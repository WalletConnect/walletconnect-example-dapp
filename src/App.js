import React, { Component } from "react";
import styled from "styled-components";
import BaseLayout from "./components/BaseLayout";
import AssetRow from "./components/AssetRow";
import Button from "./components/Button";
import Column from "./components/Column";
import { fonts } from "./styles";
import {
  walletConnectInitSession,
  walletConnectListenSessionStatus,
  walletConnectRemoveSession
} from "./helpers/walletconnect";
import { apiGetAccountBalances } from "./helpers/api";
import { parseAccountBalances } from "./helpers/parsers";

const StyledLanding = styled.div`
  width: 100%;
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

const StyledAssetList = styled.div`
  display: flex;
`;

class App extends Component {
  state = {
    network: "mainnet",
    showModal: false,
    uri: "",
    accounts: [],
    address: "",
    assets: []
  };
  openModal = () => {
    this.setState({ showModal: true });
    if (!this.state.accounts.length) {
      walletConnectRemoveSession();
    }
  };
  closeModal = () => {
    this.setState({ showModal: !this.state.showModal });
    console.log(this.state);
    if (this.state.uri) {
      this.setState({ uri: "" });
    }
  };
  _walletConnectInit = async () => {
    const session = await walletConnectInitSession(); // Initiate session
    console.log("session", session);
    if (session) {
      if (session.new) {
        const { uri } = session; // Display QR code with URI string
        this.setState({ uri });
        this.openModal();
      } else {
        const session = await walletConnectListenSessionStatus(); // Listen to session status
        const { accounts } = session; // Get wallet accounts
        this.setState({ accounts });
        this._getAccountBalances();
      }
    } else {
      console.log("FAILED TO CONNECT");
    }
  };
  _getAccountBalances = async () => {
    const { address, network } = this.state;
    const { data } = await apiGetAccountBalances(address, network);
    const assets = parseAccountBalances(data);
    this.setState({ assets });
  };
  render = () => (
    <BaseLayout
      address={this.state.address}
      uri={this.state.uri}
      showModal={this.state.showModal}
      closeModal={this.closeModal}
    >
      <StyledLanding>
        <h1>WalletConnect Example Dapp</h1>
        {!this.state.address && !this.state.assets.length ? (
          <StyledButtonContainer>
            <StyledConnectButton
              left
              color="walletconnect"
              onClick={this._walletConnectInit}
            >
              {"Connect to WalletConnect"}
            </StyledConnectButton>
          </StyledButtonContainer>
        ) : (
          <StyledAssetList>
            {this.state.assets.map(asset => <AssetRow asset={asset} />)}
          </StyledAssetList>
        )}
      </StyledLanding>
    </BaseLayout>
  );
}

export default App;
