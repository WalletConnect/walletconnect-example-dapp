import React, { Component } from "react";
import styled from "styled-components";
import BaseLayout from "./components/BaseLayout";
import AssetRow from "./components/AssetRow";
import Button from "./components/Button";
import Column from "./components/Column";
import { fonts } from "./styles";
import {
  walletConnectInitSession,
  walletConnectGetAccounts,
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
    fetching: false,
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
  _handleAccounts = accounts => {
    if (accounts && accounts.length) {
      this._getAccountBalances();
      this.setState({ accounts });
    } else {
      console.log("FAILED TO GET ACCOUNTS");
    }
  };
  _walletConnectInit = async () => {
    this.setState({ fetching: true });
    const session = await walletConnectInitSession(); // Initiate session
    this.setState({ fetching: false });
    console.log("session", session);
    if (session) {
      if (session.new) {
        const { uri } = session; // Display QR code with URI string

        this.setState({ uri });
        this.openModal();

        const accounts = await walletConnectGetAccounts(); // Get wallet accounts
        console.log("accounts new", accounts);
        this._handleAccounts(accounts);
      } else {
        const accounts = session.accounts; // Get wallet accounts
        console.log("accounts old", accounts);
        this._handleAccounts(accounts);
      }
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
              fetching={this.state.fetching}
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
