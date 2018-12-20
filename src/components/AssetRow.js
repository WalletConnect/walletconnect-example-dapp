import React from "react";
import styled from "styled-components";
import Icon from "./Icon";
import { ERC20Icon } from "dapparatus";
import eth from "../assets/eth.svg";
import { handleSignificantDecimals } from "../helpers/bignumber";

const SAssetRow = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: space-between;
`;
const SAssetRowLeft = styled.div`
  display: flex;
`;
const SAssetName = styled.div`
  display: flex;
  margin-left: 10px;
`;
const SAssetRowRight = styled.div`
  display: flex;
`;
const SAssetBalance = styled.div`
  display: flex;
`;

const AssetRow = ({ asset, ...props }) => (
  <SAssetRow {...props}>
    <SAssetRowLeft>
      {asset.symbol && asset.symbol.toLowerCase() === "eth" ? (
        <Icon icon={eth} />
      ) : (
        <ERC20Icon tokenAddress={asset.address} />
      )}
      <SAssetName>{asset.name}</SAssetName>
    </SAssetRowLeft>
    <SAssetRowRight>
      <SAssetBalance>
        {`${handleSignificantDecimals(asset.balance, 8)} ${asset.symbol}`}
      </SAssetBalance>
    </SAssetRowRight>
  </SAssetRow>
);

export default AssetRow;
