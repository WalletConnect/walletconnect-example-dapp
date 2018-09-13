import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Wrapper from "../components/Wrapper";
import Column from "../components/Column";
// import Notification from "../components/Notification";
import Modal from "../components/Modal";
import Blockie from "../components/Blockie";
import { ellipseAddress } from "../helpers/utilities";
import branding from "../assets/walletconnect-branding.png";

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

const StyledHeader = styled.div`
  margin-top: -1px;
  margin-bottom: 1px;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`;

const StyledBrandingWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const StyledBranding = styled.div`
  width: 275px;
  height: 45px;
  background: url(${branding}) no-repeat;
  background-size: cover;
  background-position: center;
`;

const StyledActiveAccount = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  font-weight: 500;
`;

const BaseLayout = ({
  children,
  address,
  showModal,
  closeModal,
  uri,
  ...props
}) => {
  return (
    <StyledLayout>
      <Column maxWidth={1000} spanHeight>
        <StyledHeader>
          <StyledBrandingWrapper>
            <StyledBranding alt="WalletConnect" />
          </StyledBrandingWrapper>
          {address && (
            <StyledActiveAccount>
              <Blockie seed={address} />
              <p>{ellipseAddress(address)}</p>
            </StyledActiveAccount>
          )}
        </StyledHeader>
        <StyledContent>{children}</StyledContent>
      </Column>
      {/* <Notification /> */}
      <Modal uri={uri} showModal={showModal} closeModal={closeModal} />
    </StyledLayout>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired,
  address: PropTypes.string,
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  uri: PropTypes.string
};

export default BaseLayout;
