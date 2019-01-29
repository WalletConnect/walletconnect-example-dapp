import axios, { AxiosInstance } from "axios";
import {
  IAssetData,
  IGasPrices,
  IBlockScoutTx,
  IBlockScoutTokenTx,
  IParsedTx,
  ITxOperation
} from "./types";
import { convertStringToNumber, divide, multiply } from "./bignumber";
import { getChainData } from "./utilities";
import functionNames from "./functionNames";

const api: AxiosInstance = axios.create({
  baseURL: "https://blockscout.com/",
  timeout: 30000, // 30 secs
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export async function apiGetAccountBalance(address: string, chainId: number) {
  const chainData = getChainData(chainId);
  const chain = chainData.chain.toLowerCase();
  const network = chainData.network.toLowerCase();
  const module = "account";
  const action = "balance";
  const url = `/${chain}/${network}/api?module=${module}&action=${action}&address=${address}`;
  const result = await api.get(url);
  return result;
}

export async function apiGetAccountTokenList(address: string, chainId: number) {
  const chainData = getChainData(chainId);
  const chain = chainData.chain.toLowerCase();
  const network = chainData.network.toLowerCase();
  const module = "account";
  const action = "tokenlist";
  const url = `/${chain}/${network}/api?module=${module}&action=${action}&address=${address}`;
  const result = await api.get(url);
  return result;
}

export async function apiGetAccountTokenBalance(
  address: string,
  chainId: number,
  contractAddress: string
) {
  const chainData = getChainData(chainId);
  const chain = chainData.chain.toLowerCase();
  const network = chainData.network.toLowerCase();
  const module = "account";
  const action = "tokenbalance";
  const url = `/${chain}/${network}/api?module=${module}&action=${action}&contractaddress=${contractAddress}&address=${address}`;
  const result = await api.get(url);
  return result;
}

export async function apiGetAccountAssets(address: string, chainId: number) {
  const chainData = getChainData(chainId);

  const nativeCurrency: IAssetData =
    chainData.chain.toLowerCase() !== "dai"
      ? {
          symbol: "ETH",
          name: "Ethereum",
          decimals: "18",
          contractAddress: "",
          balance: ""
        }
      : {
          symbol: "DAI",
          name: "Dai Stablecoin v1.0",
          decimals: "18",
          contractAddress: "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
          balance: ""
        };
  const balanceRes = await apiGetAccountBalance(address, chainId);
  nativeCurrency.balance = balanceRes.data.result;

  const tokenListRes = await apiGetAccountTokenList(address, chainId);
  const tokenList: IAssetData[] = tokenListRes.data.result;

  let tokens: IAssetData[] = await Promise.all(
    tokenList.map(
      async (token: IAssetData): Promise<IAssetData> => {
        const tokenBalanceRes = await apiGetAccountTokenBalance(
          address,
          chainId,
          token.contractAddress
        );

        const tokenBalance = tokenBalanceRes.data.result;

        if (
          tokenBalance &&
          !Number.isNaN(tokenBalance) &&
          !!Number(tokenBalance)
        ) {
          token.balance = tokenBalance;
        }

        return token;
      }
    )
  );
  tokens = tokens.filter(
    token =>
      !!Number(token.balance) &&
      !!token.balance &&
      !!token.decimals &&
      !!token.name
  );

  const assets: IAssetData[] = [nativeCurrency, ...tokens];

  return assets;
}

export async function apiGetAccountTxList(address: string, chainId: number) {
  const chainData = getChainData(chainId);
  const chain = chainData.chain.toLowerCase();
  const network = chainData.network.toLowerCase();
  const module = "account";
  const action = "txlist";
  const url = `/${chain}/${network}/api?module=${module}&action=${action}&address=${address}`;
  const result = await api.get(url);
  return result;
}

export async function apiGetAccountTokenTx(address: string, chainId: number) {
  const chainData = getChainData(chainId);
  const chain = chainData.chain.toLowerCase();
  const network = chainData.network.toLowerCase();
  const module = "account";
  const action = "tokentx";
  const url = `/${chain}/${network}/api?module=${module}&action=${action}&address=${address}`;
  const result = await api.get(url);
  return result;
}

export async function apiGetAccountTransactions(
  address: string,
  chainId: number
) {
  const txListRes = await apiGetAccountTxList(address, chainId);
  const txList: IBlockScoutTx[] = txListRes.data.result;

  const transactions: IParsedTx[] = txList.map(
    (tx: IBlockScoutTx): IParsedTx => {
      const asset: IAssetData = {
        symbol: "ETH",
        name: "Ethereum",
        decimals: "18",
        contractAddress: ""
      };

      const parsedTx: IParsedTx = {
        timeStamp: multiply(tx.timeStamp, 1000),
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        nonce: tx.nonce,
        gasPrice: tx.gasPrice,
        gasUsed: tx.gasUsed,
        fee: multiply(tx.gasPrice, tx.gasUsed),
        value: tx.value,
        input: tx.input,
        error: tx.isError === "1",
        asset,
        operations: []
      };
      return parsedTx;
    }
  );

  const tokenTxnsRes = await apiGetAccountTokenTx(address, chainId);
  const tokenTxns: IBlockScoutTokenTx[] = tokenTxnsRes.data.result;

  tokenTxns.forEach((tokenTx: IBlockScoutTokenTx) => {
    const asset: IAssetData = {
      symbol: tokenTx.tokenSymbol,
      name: tokenTx.tokenName,
      decimals: tokenTx.tokenDecimal,
      contractAddress: tokenTx.contractAddress
    };

    const functionHash = tokenTx.input.substring(0, 10);

    const operation: ITxOperation = {
      asset,
      value: tokenTx.value,
      from: tokenTx.from,
      to: tokenTx.to,
      functionName: functionNames[functionHash] || functionHash
    };

    let matchingTx = false;

    for (const tx of transactions) {
      if (tokenTx.hash.toLowerCase() === tx.hash.toLowerCase()) {
        tx.operations.push(operation);
        matchingTx = true;
        break;
      }
    }
    if (!matchingTx) {
      const asset: IAssetData = {
        symbol: "ETH",
        name: "Ethereum",
        decimals: "18",
        contractAddress: ""
      };

      const parsedTx: IParsedTx = {
        timeStamp: multiply(tokenTx.timeStamp, 100),
        hash: tokenTx.hash,
        from: tokenTx.from,
        to: tokenTx.to,
        nonce: tokenTx.nonce,
        gasPrice: tokenTx.gasPrice,
        gasUsed: tokenTx.gasUsed,
        fee: multiply(tokenTx.gasPrice, tokenTx.gasUsed),
        value: tokenTx.value,
        input: tokenTx.input,
        error: false,
        asset,
        operations: []
      };
      transactions.push(parsedTx);
    }
  });

  transactions.sort(
    (a, b) => parseInt(b.timeStamp, 10) - parseInt(a.timeStamp, 10)
  );

  return transactions;
}

export const apiGetGasPrices = async (): Promise<IGasPrices> => {
  const { data } = await axios.get(
    `https://ethgasstation.info/json/ethgasAPI.json`
  );
  const result: IGasPrices = {
    slow: {
      time: convertStringToNumber(multiply(data.safeLowWait, 60)),
      price: convertStringToNumber(divide(data.safeLow, 10))
    },
    average: {
      time: convertStringToNumber(multiply(data.avgWait, 60)),
      price: convertStringToNumber(divide(data.average, 10))
    },
    fast: {
      time: convertStringToNumber(multiply(data.fastestWait, 60)),
      price: convertStringToNumber(divide(data.fastest, 10))
    }
  };
  return result;
};

export const apiGetAccountNonce = (
  address: string,
  chainId: number
): Promise<any> => {
  const chainData = getChainData(chainId);
  if (chainData.chain !== "ETH") {
    throw new Error("Chain not supported");
  }
  const network = chainData.network;
  return axios.post(`https://${network}.infura.io/`, {
    jsonrpc: "2.0",
    id: Date.now(),
    method: "eth_getTransactionCount",
    params: [address, "pending"]
  });
};
