import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Blockie } from "dapparatus";
import { ellipseAddress } from "../helpers/utilities";
import banner from "../assets/walletconnect-banner.png";
import { transitions } from "../styles";

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

const StyledBannerWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const StyledBanner = styled.div`
  width: 275px;
  height: 45px;
  background: url(${banner}) no-repeat;
  background-size: cover;
  background-position: center;
`;

const StyledActiveAccount = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  font-weight: 500;
`;

const StyledDisconnect = styled.div`
  transition: ${transitions.button};
  font-size: 12px;
  font-family: monospace;
  position: absolute;
  right: 0;
  top: 30px;
  opacity: 0.7;
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.5;
  }
`;

const StyledBockieWrapper = styled.div`
  margin-right: 10px;
  & canvas {
    border-radius: 3px;
  }
`;

const Header = ({ killSession, address, ...props }) => {
  return (
    <StyledHeader {...props}>
      <StyledBannerWrapper>
        <StyledBanner alt="WalletConnect" />
      </StyledBannerWrapper>
      {address && (
        <StyledActiveAccount>
          <StyledBockieWrapper>
            <Blockie address={address} config={{ size: 4 }} />
          </StyledBockieWrapper>
          <p>{ellipseAddress(address)}</p>
          <StyledDisconnect onClick={killSession}>
            {"Disconnect"}
          </StyledDisconnect>
        </StyledActiveAccount>
      )}
    </StyledHeader>
  );
};

Header.propTypes = {
  killSession: PropTypes.func.isRequired,
  address: PropTypes.string
};

export default Header;
