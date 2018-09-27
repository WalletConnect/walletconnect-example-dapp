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
  walletConnectGetURI,
  walletConnectListenSessionStatus,
  walletConnectResetSession
} from "./helpers/walletconnect";
import { apiGetAccountBalances } from "./helpers/api";
import { parseAccountBalances } from "./helpers/parsers";

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

const StyledBalances = styled(StyledLanding)`
  padding-top: 60px;
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
    // toggle modal
    await this.setState({ showModal: !this.state.showModal });

    if (!this.state.showModal) {
      // clear uri if closing modal
      await this.setState({ uri: "" });

      if (!this.state.accounts.length) {
        // reset session if closing modal without accounts
        walletConnectResetSession();
      }
    }
  };

  _walletConnectInit = async () => {
    /**
     *  Initiate WalletConnect session
     */
    await walletConnectInitSession();

    /**
     *  Get accounts (type: <Array>)
     */
    let accounts = walletConnectGetAccounts();

    /**
     *  Check if accounts is empty array
     */
    if (!accounts.length) {
      await this.setState({ fetching: true });

      // If there is no accounts, prompt the user to scan the QR code
      const uri = walletConnectGetURI();
      this.setState({ uri });
      this.toggleModal();

      // Listen for session confirmation from wallet
      await walletConnectListenSessionStatus();

      // Get accounts after session status is resolved
      accounts = walletConnectGetAccounts();
      await this.setState({ fetching: false });
    }

    if (accounts && accounts.length) {
      // Close Modal if accounts are available
      if (this.state.showModal) {
        this.toggleModal();
      }

      // Display account balances
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
      {!this.state.address && !this.state.assets.length ? (
        <StyledLanding center>
          <h2>Check your Ether & Token balances</h2>
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
        </StyledLanding>
      ) : (
        <StyledBalances>
          <h3>Balances</h3>
          <Column center>
            {this.state.assets.map(asset => (
              <AssetRow key={asset.symbol} asset={asset} />
            ))}
          </Column>
        </StyledBalances>
      )}
    </BaseLayout>
  );
}

export default App;
