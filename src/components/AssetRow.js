import React from "react";
import styled from "styled-components";
import ERC20Icon from "./ERC20Icon";
import { handleSignificantDecimals } from "../helpers/bignumber";
import eth from "../assets/eth.svg";

const StyledAssetRow = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: space-between;
`;
const StyledAssetRowLeft = styled.div`
  display: flex;
`;
const StyledAssetName = styled.div`
  display: flex;
  margin-left: 10px;
`;
const StyledAssetRowRight = styled.div`
  display: flex;
`;
const StyledAssetBalance = styled.div`
  display: flex;
`;

const AssetRow = ({ asset, ...props }) => (
  <StyledAssetRow>
    <StyledAssetRowLeft>
      {asset.symbol.toLowerCase() === "eth" ? (
        <img style={{ width: 20, height: 20 }} src={eth} alt="erc-20" />
      ) : (
        <ERC20Icon tokenAddress={asset.address} />
      )}
      <StyledAssetName>{asset.name}</StyledAssetName>
    </StyledAssetRowLeft>
    <StyledAssetRowRight>
      <StyledAssetBalance>
        {`${handleSignificantDecimals(asset.balance, 8)} ${asset.symbol}`}
      </StyledAssetBalance>
    </StyledAssetRowRight>
  </StyledAssetRow>
);

export default AssetRow;
