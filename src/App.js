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
  walletConnectResetSession
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

  toggleModal = async () => {
    await this.setState({ showModal: !this.state.showModal });

    if (!this.state.showModal) {
      if (this.state.uri) {
        await this.setState({ uri: "" });
      }
      if (!this.state.accounts.length) {
        walletConnectResetSession();
      }
    }
  };

  _walletConnectInit = async () => {
    await this.setState({ fetching: true });

    const session = await walletConnectInitSession(); // Initiate session

    await this.setState({ fetching: false });

    let accounts = null;

    if (session) {
      if (session.new) {
        const { uri } = session; // Display QR code with URI string

        await this.setState({ uri });
        this.toggleModal();
        const result = await walletConnectGetAccounts(); // Get wallet accounts
        if (result) {
          accounts = result.accounts;
        }
      } else {
        accounts = session.accounts; // Get wallet accounts
      }
    }

    if (accounts && accounts.length) {
      this.toggleModal();
      const { network } = this.state;
      const address = accounts[0];
      const { data } = await apiGetAccountBalances(address, network);
      const assets = parseAccountBalances(data);
      await this.setState({ accounts, address, assets });
    } else {
    }
  };

  render = () => (
    <BaseLayout
      address={this.state.address}
      uri={this.state.uri}
      showModal={this.state.showModal}
      toggleModal={this.toggleModal}
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
