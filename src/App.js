import React, { Component } from "react";
import styled from "styled-components";
import WalletConnect from "walletconnect";
import WalletConnectQRCodeModal from "walletconnect-qrcode-modal";
import AssetRow from "./components/AssetRow";
import Button from "./components/Button";
import Column from "./components/Column";
import Wrapper from "./components/Wrapper";
import Modal from "./components/Modal";
import Header from "./components/Header";
import Loader from "./components/Loader";
import { fonts } from "./styles";
import {
  apiGetAccountBalances,
  apiGetGasPrices,
  apiGetAccountNonce
} from "./helpers/api";
import {
  ecrecover,
  fromRpcSig,
  bufferToHex,
  sanitizeHex
} from "./helpers/utilities";
import {
  divide,
  convertAmountToRawNumber,
  convertStringToHex
} from "./helpers/bignumber";
import { parseAccountBalances } from "./helpers/parsers";

const StyledLayout = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  text-align: center;
`;

const StyledContent = styled(Wrapper)`
  width: 100%;
  height: 100%;
  padding: 0 16px;
`;

const StyledLanding = styled(Column)`
  height: 600px;
`;

const StyledButtonContainer = styled(Column)`
  width: 250px;
  margin: 50px 0;
`;

const StyledConnectButton = styled(Button)`
  border-radius: 8px;
  font-size: ${fonts.size.medium};
  height: 44px;
  width: 100%;
  margin: 12px 0;
`;

const StyledContainer = styled.div`
  height: 100%;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  word-break: break-word;
`;

const StyledModalTitle = styled.div`
  margin: 1em 0;
  font-size: 20px;
  font-weight: 700;
`;

const StyledBalances = styled(StyledLanding)`
  height: 100%;
  & h3 {
    padding-top: 30px;
  }
`;

const StyledTable = styled(StyledContainer)`
  flex-direction: column;
  text-align: left;
`;

const StyledRow = styled.div`
  width: 100%;
  display: flex;
  margin: 6px 0;
`;

const StyledKey = styled.div`
  width: 30%;
  font-weight: 700;
`;

const StyledValue = styled.div`
  width: 70%;
  font-family: monospace;
`;

const StyledTestButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledTestButton = styled(Button)`
  border-radius: 8px;
  font-size: ${fonts.size.medium};
  height: 44px;
  width: 100%;
  margin: 12px;
`;

const INITIAL_STATE = {
  webConnector: null,
  fetching: false,
  network: "mainnet",
  showModal: false,
  pendingRequest: false,
  uri: "",
  accounts: [],
  address: "",
  result: null,
  assets: []
};

class App extends Component {
  state = {
    bridgeUrl: "https://test-bridge.walletconnect.org",
    dappName: "Example Dapp",
    ...INITIAL_STATE
  };

  componentDidMount() {
    this.createWebConnector();
  }

  createWebConnector() {
    const { bridgeUrl, dappName } = this.state;

    const webConnector = new WalletConnect({ bridgeUrl, dappName });

    this.setState({ webConnector });

    return webConnector;
  }

  walletConnectInit = async () => {
    let { webConnector } = this.state;

    if (!webConnector) {
      webConnector = this.createWebConnector();
    }

    // Initiate WalletConnect session
    await webConnector.initSession();

    // Expose webConnector for console debugging
    window.webConnector = webConnector;

    //  Get accounts array
    let accounts = webConnector.accounts;

    // Check if accounts is empty array
    if (!accounts.length) {
      await this.setState({ fetching: true });

      // If there is no accounts, prompt the user to scan the QR code
      const uri = webConnector.uri;

      // Create QR Code callback on close
      const onQRCodeClose = () => {
        webConnector.stopLastListener();
        this.setState({ fetching: false });
      };

      // Display QR Code
      WalletConnectQRCodeModal.open(uri, onQRCodeClose);

      // Listen for session confirmation from wallet
      await webConnector.listenSessionStatus();

      // Close QR Code
      WalletConnectQRCodeModal.close();

      // Get accounts after session status is resolved
      accounts = webConnector.accounts;
      await this.setState({ fetching: false });
    }

    if (accounts && accounts.length) {
      const address = accounts[0];
      await this.setState({ accounts, address });

      // Display account balances
      await this.getAccountBalances();
    }

    this.setState({ webConnector });
  };

  killSession = async () => {
    this.state.webConnector.killSession();
    this.setState({ ...INITIAL_STATE });
  };

  getAccountBalances = async () => {
    const { address, network } = this.state;
    this.setState({ fetching: true });

    // get account balances
    const { data } = await apiGetAccountBalances(address, network);
    const assets = parseAccountBalances(data);

    await this.setState({ fetching: false, address, assets });
  };

  toggleModal = () => {
    const newState = {};

    if (this.state.pendingRequest) {
      // stop last walletconnect listener
      this.state.webConnector.stopLastListener();
      newState.pendingRequest = false;
    }

    // toggle modal state
    newState.showModal = !this.state.showModal;

    // reset result state
    newState.result = INITIAL_STATE.result;

    this.setState(newState);
  };

  testSendTransaction = async () => {
    const { webConnector, address, network } = this.state;

    // get account nonce
    const nonceRes = await apiGetAccountNonce(address, network);
    const nonce = nonceRes.data.result;

    // get current gas prices
    const gasPriceRes = await apiGetGasPrices();
    const gasPrice = divide(gasPriceRes.data.safeLow, 10);

    // set gas limit
    const gasLimit = 21000;

    // test transaction
    const tx = {
      from: address,
      to: address,
      nonce: nonce,
      gasPrice: sanitizeHex(
        convertStringToHex(convertAmountToRawNumber(gasPrice, 9))
      ),
      gasLimit: sanitizeHex(convertStringToHex(gasLimit)),
      value: "0x00",
      input: "0x00"
    };

    try {
      // open modal
      this.toggleModal();

      // toggle pending request indicator
      this.setState({ pendingRequest: true });

      // send transaction
      const result = await webConnector.sendTransaction(tx);

      // format displayed result
      const formattedResult = {
        method: "eth_sendTransaction",
        txHash: result,
        from: address,
        to: address,
        value: "0 ETH",
        gasPrice: `${gasPrice} gwei`
      };

      // display result
      this.setState({
        webConnector,
        pendingRequest: false,
        result: formattedResult || null
      });
    } catch (error) {
      console.error(error);
      this.setState({ webConnector, pendingRequest: false, result: null });
    }
  };

  testSignMessage = async () => {
    const { webConnector, address } = this.state;

    // test message
    const msgParams = [address, "My email is john@doe.com - 1537836206101"];

    try {
      // open modal
      this.toggleModal();

      // toggle pending request indicator
      this.setState({ pendingRequest: true });

      // send message
      const result = await webConnector.signMessage(msgParams);

      // verify signature
      const signer = ecrecover(msgParams[1], result);
      const verified = signer.toLowerCase() === address.toLowerCase();

      // signature params
      const sigParams = fromRpcSig(result);

      // format displayed result
      const formattedResult = {
        method: "eth_sign",
        address: address,
        verified: verified,
        v: bufferToHex(sigParams.v),
        r: bufferToHex(sigParams.r),
        s: bufferToHex(sigParams.s)
      };

      // display result
      this.setState({
        webConnector,
        pendingRequest: false,
        result: formattedResult || null
      });
    } catch (error) {
      console.error(error);
      this.setState({ webConnector, pendingRequest: false, result: null });
    }
  };

  testSignTypedData = async () => {
    const { webConnector, address } = this.state;

    // test typed data
    const msgParams = [
      {
        type: "string",
        name: "Message",
        value: "My email is john@doe.com"
      },
      {
        type: "uint32",
        name: "A number",
        value: "1537836206101"
      }
    ];

    try {
      // open modal
      this.toggleModal();

      // toggle pending request indicator
      this.setState({ pendingRequest: true });

      // sign typed data
      const result = await webConnector.signTypedData(msgParams);

      // verify signature
      const signer = ecrecover(msgParams, result);
      const verified = signer.toLowerCase() === address.toLowerCase();

      // signature params
      const sigParams = fromRpcSig(result);

      // format displayed result
      const formattedResult = {
        method: "eth_signTypedData",
        address: address,
        verified: verified,
        v: bufferToHex(sigParams.v),
        r: bufferToHex(sigParams.r),
        s: bufferToHex(sigParams.s)
      };

      // display result
      this.setState({
        webConnector,
        pendingRequest: false,
        result: formattedResult || null
      });
    } catch (error) {
      console.error(error);
      this.setState({ webConnector, pendingRequest: false, result: null });
    }
  };

  render = () => {
    const {
      assets,
      address,
      fetching,
      showModal,
      pendingRequest,
      result
    } = this.state;
    let ethereum = {
      address: null,
      name: "Ethereum",
      symbole: "ETH",
      decimals: 18,
      balance: "0"
    };
    let tokens = [];
    if (assets.length) {
      ethereum = assets.filter(
        asset => asset.symbol.toLowerCase() === "eth"
      )[0];
      tokens = assets.filter(asset => asset.symbol.toLowerCase() !== "eth");
    }
    return (
      <StyledLayout>
        <Column maxWidth={1000} spanHeight>
          <Header address={address} killSession={this.killSession} />
          <StyledContent>
            {!address && !assets.length ? (
              <StyledLanding center>
                <h2>Try out WalletConnect!</h2>
                <StyledButtonContainer>
                  <StyledConnectButton
                    left
                    color="walletconnect"
                    onClick={this.walletConnectInit}
                    fetching={fetching}
                  >
                    {"Connect to WalletConnect"}
                  </StyledConnectButton>
                </StyledButtonContainer>
              </StyledLanding>
            ) : (
              <StyledBalances>
                <h3>Actions</h3>
                <Column center>
                  <StyledTestButtonContainer>
                    <StyledTestButton
                      left
                      color="walletconnect"
                      onClick={this.testSendTransaction}
                    >
                      {"Send Test Transaction"}
                    </StyledTestButton>

                    <StyledTestButton
                      left
                      color="walletconnect"
                      onClick={this.testSignMessage}
                    >
                      {"Sign Test Message"}
                    </StyledTestButton>

                    <StyledTestButton
                      left
                      disabled
                      color="walletconnect"
                      onClick={this.testSignTypedData}
                    >
                      {"Sign Test Typed Data"}
                    </StyledTestButton>
                  </StyledTestButtonContainer>
                </Column>
                <h3>Balances</h3>
                {!fetching ? (
                  <Column center>
                    <AssetRow key="Ethereum" asset={ethereum} />
                    {tokens.map(token => (
                      <AssetRow key={token.symbol} asset={token} />
                    ))}
                  </Column>
                ) : (
                  <Column center>
                    <StyledContainer>
                      <Loader />
                    </StyledContainer>
                  </Column>
                )}
              </StyledBalances>
            )}
          </StyledContent>
        </Column>
        <Modal show={showModal} toggleModal={this.toggleModal}>
          {pendingRequest ? (
            <div>
              <StyledModalTitle>{"Pending Call Request"}</StyledModalTitle>
              <StyledContainer>
                <Loader />
              </StyledContainer>
            </div>
          ) : result ? (
            <div>
              <StyledModalTitle>{"Call Request Approved"}</StyledModalTitle>
              <StyledTable>
                {Object.keys(result).map(key => (
                  <StyledRow key={key}>
                    <StyledKey>{key}</StyledKey>
                    <StyledValue>{result[key].toString()}</StyledValue>
                  </StyledRow>
                ))}
              </StyledTable>
            </div>
          ) : (
            <div>
              <StyledModalTitle>{"Call Request Rejected"}</StyledModalTitle>
              {/* <StyledContainer /> */}
            </div>
          )}
        </Modal>
      </StyledLayout>
    );
  };
}

export default App;
