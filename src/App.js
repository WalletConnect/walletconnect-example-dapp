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
  recoverTypedSignature
} from "./helpers/ethSigUtil";
import { sanitizeHex } from "./helpers/utilities";
import {
  divide,
  convertAmountToRawNumber,
  convertStringToHex
} from "./helpers/bignumber";
import { parseAccountBalances } from "./helpers/parsers";

const SLayout = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  text-align: center;
`;

const SContent = styled(Wrapper)`
  width: 100%;
  height: 100%;
  padding: 0 16px;
`;

const SLanding = styled(Column)`
  height: 600px;
`;

const SButtonContainer = styled(Column)`
  width: 250px;
  margin: 50px 0;
`;

const SConnectButton = styled(Button)`
  border-radius: 8px;
  font-size: ${fonts.size.medium};
  height: 44px;
  width: 100%;
  margin: 12px 0;
`;

const SContainer = styled.div`
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  word-break: break-word;
`;

const SModalTitle = styled.div`
  margin: 1em 0;
  font-size: 20px;
  font-weight: 700;
`;

const SModalParagraph = styled.p`
  margin-top: 30px;
`;

const SBalances = styled(SLanding)`
  height: 100%;
  & h3 {
    padding-top: 30px;
  }
`;

const STable = styled(SContainer)`
  flex-direction: column;
  text-align: left;
`;

const SRow = styled.div`
  width: 100%;
  display: flex;
  margin: 6px 0;
`;

const SKey = styled.div`
  width: 30%;
  font-weight: 700;
`;

const SValue = styled.div`
  width: 70%;
  font-family: monospace;
`;

const STestButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const STestButton = styled(Button)`
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
      data: "0x"
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
        value: "0 ETH"
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
        signer: signer,
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
      address,
      {
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" }
          ],
          Person: [
            { name: "name", type: "string" },
            { name: "account", type: "address" }
          ],
          Mail: [
            { name: "from", type: "Person" },
            { name: "to", type: "Person" },
            { name: "contents", type: "string" }
          ]
        },
        primaryType: "Mail",
        domain: {
          name: "Example Dapp",
          version: "0.7.0",
          chainId: 1,
          verifyingContract: "0x0000000000000000000000000000000000000000"
        },
        message: {
          from: {
            name: "Alice",
            account: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
          },
          to: {
            name: "Bob",
            account: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
          },
          contents: "Hey, Bob!"
        }
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
      const signer = recoverTypedSignature({
        data: msgParams[1],
        sig: result
      });
      const verified = signer.toLowerCase() === address.toLowerCase();

      // signature params
      const sigParams = fromRpcSig(result);

      // format displayed result
      const formattedResult = {
        method: "eth_signTypedData",
        address: address,
        signer: signer,
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
      <SLayout>
        <Column maxWidth={1000} spanHeight>
          <Header address={address} killSession={this.killSession} />
          <SContent>
            {!address && !assets.length ? (
              <SLanding center>
                <h2>Try out WalletConnect!</h2>
                <SButtonContainer>
                  <SConnectButton
                    left
                    color="walletconnect"
                    onClick={this.walletConnectInit}
                    fetching={fetching}
                  >
                    {"Connect to WalletConnect"}
                  </SConnectButton>
                </SButtonContainer>
              </SLanding>
            ) : (
              <SBalances>
                <h3>Actions</h3>
                <Column center>
                  <STestButtonContainer>
                    <STestButton
                      left
                      color="walletconnect"
                      onClick={this.testSendTransaction}
                    >
                      {"Send Test Transaction"}
                    </STestButton>

                    <STestButton
                      left
                      color="walletconnect"
                      onClick={this.testSignMessage}
                    >
                      {"Sign Test Message"}
                    </STestButton>

                    <STestButton
                      left
                      color="walletconnect"
                      onClick={this.testSignTypedData}
                    >
                      {"Sign Test Typed Data"}
                    </STestButton>
                  </STestButtonContainer>
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
                    <SContainer>
                      <Loader />
                    </SContainer>
                  </Column>
                )}
              </SBalances>
            )}
          </SContent>
        </Column>
        <Modal show={showModal} toggleModal={this.toggleModal}>
          {pendingRequest ? (
            <div>
              <SModalTitle>{"Pending Call Request"}</SModalTitle>
              <SContainer>
                <Loader />
                <SModalParagraph>
                  {"Approve or reject request using your wallet"}
                </SModalParagraph>
              </SContainer>
            </div>
          ) : result ? (
            <div>
              <SModalTitle>{"Call Request Approved"}</SModalTitle>
              <STable>
                {Object.keys(result).map(key => (
                  <SRow key={key}>
                    <SKey>{key}</SKey>
                    <SValue>{result[key].toString()}</SValue>
                  </SRow>
                ))}
              </STable>
            </div>
          ) : (
            <div>
              <SModalTitle>{"Call Request Rejected"}</SModalTitle>
            </div>
          )}
        </Modal>
      </SLayout>
    );
  };
}

export default App;
