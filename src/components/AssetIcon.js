import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import eth from "../assets/eth.svg";
import erc20 from "../assets/erc20.svg";

const StyledIcon = styled.img`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
`;

const buildAssetSourceUrl = asset => {
  if (!asset.symbol) return erc20;
  if (asset.symbol.toUpperCase() === "ETH") return eth;
  return `/tokens/images/${asset.address}.png`;
};

const AssetIcon = ({ asset, image, size }) => (
  <StyledIcon
    onError={event => (event.target.src = erc20)}
    size={size}
    src={image || buildAssetSourceUrl(asset)}
  />
);

AssetIcon.propTypes = {
  asset: PropTypes.string,
  image: PropTypes.string,
  size: PropTypes.number
};

AssetIcon.defaultProps = {
  asset: null,
  image: "",
  size: 20
};

export default AssetIcon;
