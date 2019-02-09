import * as React from "react";
import styled from "styled-components";
import * as PropTypes from "prop-types";
import Blockie from "./Blockie";
import Banner from "./Banner";
import { ellipseAddress, getChainData } from "../helpers/utilities";
import { transitions } from "../styles";

const SHeader = styled.div`
  margin-top: -1px;
  margin-bottom: 1px;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`;

const SActiveAccount = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  font-weight: 500;
`;

const SActiveChain = styled(SActiveAccount)`
  flex-direction: column;
  text-align: left;
  align-items: flex-start;
  & p {
    font-size: 0.8em;
    margin: 0;
    padding: 0;
  }
  & p:nth-child(2) {
    font-weight: bold;
  }
`;

const SDisconnect = styled.div`
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

const SBockieWrapper = styled.div`
  margin-right: 10px;
  & canvas {
    border-radius: 3px;
  }
`;

interface IHeaderProps {
  killSession: () => void;
  connected: boolean;
  address: string;
  chainId: number;
}

const Header = (props: IHeaderProps) => {
  const { connected, address, chainId, killSession } = props;
  const activeChain = chainId ? getChainData(chainId).name : null;
  return (
    <SHeader {...props}>
      {connected && activeChain ? (
        <SActiveChain>
          <p>{`Connected to`}</p>
          <p>{activeChain}</p>
        </SActiveChain>
      ) : (
        <Banner />
      )}
      {address && (
        <SActiveAccount>
          <SBockieWrapper>
            <Blockie address={address} />
          </SBockieWrapper>
          <p>{ellipseAddress(address)}</p>
          {connected && (
            <SDisconnect onClick={killSession}>{"Disconnect"}</SDisconnect>
          )}
        </SActiveAccount>
      )}
    </SHeader>
  );
};

Header.propTypes = {
  killSession: PropTypes.func.isRequired,
  address: PropTypes.string
};

export default Header;
