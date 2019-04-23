import * as React from "react";
import styled from "styled-components";
import WalletConnect from "@walletconnect/browser";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
import { IInternalEvent } from "@walletconnect/types";
import Button from "./components/Button";
import Column from "./components/Column";
import Wrapper from "./components/Wrapper";
import Modal from "./components/Modal";
import Header from "./components/Header";
import Loader from "./components/Loader";
import { fonts } from "./styles";
import {
  apiGetAccountAssets,
  apiGetGasPrices,
  apiGetAccountNonce
} from "./helpers/api";
// import {
//   recoverTypedSignature
// } from "./helpers/ethSigUtil";
import { sanitizeHex, ecrecover } from "./helpers/utilities";
import {
  convertAmountToRawNumber,
  convertStringToHex
} from "./helpers/bignumber";
import { IAssetData } from "./helpers/types";
import Banner from "./components/Banner";
import AccountAssets from "./components/AccountAssets";

const SLayout = styled.div`
  position: relative;
  width: 100%;
  /* height: 100%; */
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

interface IAppState {
  walletConnector: WalletConnect | null;
  fetching: boolean;
  connected: boolean;
  chainId: number;
  showModal: boolean;
  pendingRequest: boolean;
  uri: string;
  accounts: string[];
  address: string;
  result: any | null;
  assets: IAssetData[];
}

const INITIAL_STATE: IAppState = {
  walletConnector: null,
  fetching: false,
  connected: false,
  chainId: 1,
  showModal: false,
  pendingRequest: false,
  uri: "",
  accounts: [],
  address: "",
  result: null,
  assets: []
};

class App extends React.Component<any, any> {
  public state: IAppState = {
    ...INITIAL_STATE
  };

  public walletConnectInit = async () => {
    // bridge url
    const bridge = "https://bridge.walletconnect.org";

    // create new walletConnector
    const walletConnector = new WalletConnect({ bridge });

    window.walletConnector = walletConnector;

    await this.setState({ walletConnector });

    // check if already connected
    if (!walletConnector.connected) {
      // create new session
      await walletConnector.createSession();

      // get uri for QR Code modal
      const uri = walletConnector.uri;

      // console log the uri for development
      console.log(uri); // tslint:disable-line

      // display QR Code modal
      WalletConnectQRCodeModal.open(uri, () => {
        console.log("QR Code Modal closed"); // tslint:disable-line
      });
    }
    // subscribe to events
    await this.subscribeToEvents();
  };
  public subscribeToEvents = () => {
    const { walletConnector } = this.state;

    if (!walletConnector) {
      return;
    }

    walletConnector.on("session_update", async (error, payload) => {
      console.log('walletConnector.on("session_update")'); // tslint:disable-line

      if (error) {
        throw error;
      }

      const { chainId, accounts } = payload.params[0];
      this.onSessionUpdate(accounts, chainId);
    });

    walletConnector.on("connect", (error, payload) => {
      console.log('walletConnector.on("connect")'); // tslint:disable-line

      if (error) {
        throw error;
      }

      this.onConnect(payload);
    });

    walletConnector.on("disconnect", (error, payload) => {
      console.log('walletConnector.on("disconnect")'); // tslint:disable-line

      if (error) {
        throw error;
      }

      this.onDisconnect();
    });

    if (walletConnector.connected) {
      const { chainId, accounts } = walletConnector;
      const address = accounts[0];
      this.setState({
        connected: true,
        chainId,
        accounts,
        address
      });
    }

    this.setState({ walletConnector });
  };

  public killSession = async () => {
    const { walletConnector } = this.state;
    if (walletConnector) {
      walletConnector.killSession();
    }
    this.resetApp();
  };

  public resetApp = async () => {
    await this.setState({ ...INITIAL_STATE });
  };

  public onConnect = async (payload: IInternalEvent) => {
    const { chainId, accounts } = payload.params[0];
    const address = accounts[0];
    await this.setState({
      connected: true,
      chainId,
      accounts,
      address
    });
    WalletConnectQRCodeModal.close();
    this.getAccountAssets();
  };

  public onDisconnect = async () => {
    WalletConnectQRCodeModal.close();
    this.resetApp();
  };

  public onSessionUpdate = async (accounts: string[], chainId: number) => {
    const address = accounts[0];
    await this.setState({ chainId, accounts, address });
    await this.getAccountAssets();
  };

  public getAccountAssets = async () => {
    const { address, chainId } = this.state;
    this.setState({ fetching: true });
    try {
      // get account balances
      const assets = await apiGetAccountAssets(address, chainId);

      await this.setState({ fetching: false, address, assets });
    } catch (error) {
      console.error(error); // tslint:disable-line
      await this.setState({ fetching: false });
    }
  };

  public toggleModal = () =>
    this.setState({ showModal: !this.state.showModal });

  public testSendTransaction = async () => {
    const { walletConnector, address, chainId } = this.state;

    if (!walletConnector) {
      return;
    }

    // from
    const from = address;

    // to
    const to = address;

    // nonce
    const _nonce = await apiGetAccountNonce(address, chainId);
    const nonce = sanitizeHex(convertStringToHex(_nonce));

    // gasPrice
    const gasPrices = await apiGetGasPrices();
    const _gasPrice = gasPrices.slow.price;
    const gasPrice = sanitizeHex(
      convertStringToHex(convertAmountToRawNumber(_gasPrice, 9))
    );

    // gasLimit
    const _gasLimit = 21000;
    const gasLimit = sanitizeHex(convertStringToHex(_gasLimit));

    // value
    const _value = 0;
    const value = sanitizeHex(convertStringToHex(_value));

    // data
    const data = "0x";

    // test transaction
    const tx = {
      from,
      to,
      nonce,
      gasPrice,
      gasLimit,
      value,
      data
    };

    try {
      // open modal
      this.toggleModal();

      // toggle pending request indicator
      this.setState({ pendingRequest: true });

      // send transaction
      const result = await walletConnector.sendTransaction(tx);

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
        walletConnector,
        pendingRequest: false,
        result: formattedResult || null
      });
    } catch (error) {
      console.error(error); // tslint:disable-line
      this.setState({ walletConnector, pendingRequest: false, result: null });
    }
  };

  public testSignMessage = async () => {
    const { walletConnector, address } = this.state;

    if (!walletConnector) {
      return;
    }

    // test message
    const msgParams = [address, "My email is john@doe.com - 1537836206101"];

    try {
      // open modal
      this.toggleModal();

      // toggle pending request indicator
      this.setState({ pendingRequest: true });

      // send message
      const result = await walletConnector.signMessage(msgParams);

      // verify signature
      const signer = ecrecover(result, msgParams[1]);
      const verified = signer.toLowerCase() === address.toLowerCase();

      // format displayed result
      const formattedResult = {
        method: "eth_sign",
        address,
        signer,
        verified,
        result
      };

      // display result
      this.setState({
        walletConnector,
        pendingRequest: false,
        result: formattedResult || null
      });
    } catch (error) {
      console.error(error); // tslint:disable-line
      this.setState({ walletConnector, pendingRequest: false, result: null });
    }
  };

  // public testSignTypedData = async () => {
  //   const { walletConnector, address } = this.state;

  //   if (!walletConnector) {
  //     return;
  //   }

  //   // test typed data
  //   const msgParams = [
  //     address,
  //     {
  //       types: {
  //         EIP712Domain: [
  //           { name: "name", type: "string" },
  //           { name: "version", type: "string" },
  //           { name: "chainId", type: "uint256" },
  //           { name: "verifyingContract", type: "address" }
  //         ],
  //         Person: [
  //           { name: "name", type: "string" },
  //           { name: "account", type: "address" }
  //         ],
  //         Mail: [
  //           { name: "from", type: "Person" },
  //           { name: "to", type: "Person" },
  //           { name: "contents", type: "string" }
  //         ]
  //       },
  //       primaryType: "Mail",
  //       domain: {
  //         name: "Example Dapp",
  //         version: "0.7.0",
  //         chainId: 1,
  //         verifyingContract: "0x0000000000000000000000000000000000000000"
  //       },
  //       message: {
  //         from: {
  //           name: "Alice",
  //           account: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  //         },
  //         to: {
  //           name: "Bob",
  //           account: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
  //         },
  //         contents: "Hey, Bob!"
  //       }
  //     }
  //   ];

  //   try {
  //     // open modal
  //     this.toggleModal();

  //     // toggle pending request indicator
  //     this.setState({ pendingRequest: true });

  //     // sign typed data
  //     const result = await walletConnector.signTypedData(msgParams);

  //      // verify signature
  //      const signer = ecrecover(result, msgParams[1]);
  //      const verified = signer.toLowerCase() === address.toLowerCase();

  //     // format displayed result
  //     const formattedResult = {
  //       method: "eth_signTypedData",
  //       address,
  //       signer,
  //       verified,
  //       result
  //     };

  //     // display result
  //     this.setState({
  //       walletConnector,
  //       pendingRequest: false,
  //       result: formattedResult || null
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     this.setState({ walletConnector, pendingRequest: false, result: null });
  //   }
  // };

  public render = () => {
    const {
      assets,
      address,
      connected,
      chainId,
      fetching,
      showModal,
      pendingRequest,
      result
    } = this.state;
    return (
      <SLayout>
        <Column maxWidth={1000} spanHeight>
          <Header
            connected={connected}
            address={address}
            chainId={chainId}
            killSession={this.killSession}
          />
          <SContent>
            {!address && !assets.length ? (
              <SLanding center>
                <h3>
                  {`Try out WalletConnect`}
                  <br />
                  <span>{`v${process.env.REACT_APP_VERSION}`}</span>
                </h3>
                <SButtonContainer>
                  <SConnectButton
                    left
                    onClick={this.walletConnectInit}
                    fetching={fetching}
                  >
                    {"Connect to WalletConnect"}
                  </SConnectButton>
                </SButtonContainer>
              </SLanding>
            ) : (
              <SBalances>
                <Banner />
                <h3>Actions</h3>
                <Column center>
                  <STestButtonContainer>
                    <STestButton left onClick={this.testSendTransaction}>
                      {"Send Test Transaction"}
                    </STestButton>

                    <STestButton left onClick={this.testSignMessage}>
                      {"Sign Test Message"}
                    </STestButton>

                    <STestButton
                      disabled
                      left
                      // onClick={this.testSignTypedData}
                    >
                      {"Sign Test Typed Data"}
                    </STestButton>
                  </STestButtonContainer>
                </Column>
                <h3>Balances</h3>
                {!fetching ? (
                  <AccountAssets chainId={chainId} assets={assets} />
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
