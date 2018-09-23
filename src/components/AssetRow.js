import React from "react";
import styled from "styled-components";
import AssetIcon from "./AssetIcon";
import { handleSignificantDecimals } from "../helpers/bignumber";

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
      <AssetIcon asset={asset.symbol} />
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
