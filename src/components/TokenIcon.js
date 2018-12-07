import React from "react";
import PropTypes from "prop-types";
import Icon from "./Icon";
import erc20 from "../assets/erc20.svg";

const TokenIcon = ({ tokenAddress, size }) => (
  <Icon
    icon={
      tokenAddress
        ? `https://raw.githubusercontent.com/TrustWallet/tokens/master/images/${tokenAddress}.png`
        : erc20
    }
    size={size}
    onError={event => (event.target.src = erc20)}
  />
);

TokenIcon.propTypes = {
  tokenAddress: PropTypes.string,
  size: PropTypes.number
};

TokenIcon.defaultProps = {
  tokenAddress: null,
  size: 20
};

export default TokenIcon;
