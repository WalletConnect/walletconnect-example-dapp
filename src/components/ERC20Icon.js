import React from "react";
import PropTypes from "prop-types";
import erc20 from "../assets/erc20.svg";

const ERC20Icon = ({ tokenAddress, size, ...props }) => {
  return (
    <img
      style={{ width: size, height: size }}
      onError={event => (event.target.src = erc20)}
      size={size}
      src={
        tokenAddress
          ? `https://raw.githubusercontent.com/TrustWallet/tokens/master/images/${tokenAddress}.png`
          : erc20
      }
      alt="erc-20"
    />
  );
};

ERC20Icon.propTypes = {
  tokenAddress: PropTypes.string,
  size: PropTypes.number
};

ERC20Icon.defaultProps = {
  tokenAddress: null,
  size: 20
};

export default ERC20Icon;
