import React, { Component } from "react";
import styled from "styled-components";
import BaseLayout from "./components/BaseLayout";
import Button from "./components/Button";
import Column from "./components/Column";
import { fonts } from "./styles";
import {
  walletConnectInitSession,
  walletConnectListenSessionStatus
} from "./helpers/walletconnect";

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

class App extends Component {
  state = {
    showModal: false,
    uri: "",
    accounts: []
  };
  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };
  _walletConnectInit = async () => {
    const session = await walletConnectInitSession(); // Initiate session
    console.log("session", session);
    if (session) {
      if (session.new) {
        const { uri } = session; // Display QR code with URI string
        this.setState({ uri });
        this.toggleModal();
      } else {
        const session = await walletConnectListenSessionStatus(); // Listen to session status
        const { accounts } = session; // Get wallet accounts
        this.setState({ accounts });
      }
    } else {
      console.log("FAILED TO CONNECT");
    }
  };
  render = () => (
    <BaseLayout
      uri={this.state.uri}
      showModal={this.state.showModal}
      toggleModal={this.toggleModal}
    >
      <StyledLanding>
        <h1>WalletConnect Example Dapp</h1>
        <StyledButtonContainer>
          <StyledConnectButton
            left
            color="walletconnect"
            onClick={this._walletConnectInit}
          >
            {"Connect to WalletConnect"}
          </StyledConnectButton>
        </StyledButtonContainer>
      </StyledLanding>
    </BaseLayout>
  );
}

export default App;
