import { convertAmountFromRawNumber } from "./bignumber";

export const parseAccountBalances = data => {
  const assets = data.map(asset => {
    const balance = convertAmountFromRawNumber(asset.balance, asset.decimals);
    return {
      address: asset.contract.address,
      name: asset.contract.name,
      symbol: asset.contract.symbol,
      decimals: asset.contract.decimals,
      balance
    };
  });
  return assets;
};

export const parseAccountTransactions = (data, network) => {
  const transactions = [];

  if (!!data && data.docs) {
    data.docs.forEach(doc => {
      if (doc.operations) {
        // token transfers
        doc.operations
          .filter(op => op.type === "token_transfer")
          .forEach(op => {
            const tokenTx = {
              transactionId: op.transactionId,
              asset: {
                symbol: op.contract.symbol,
                decimals: op.contract.decimals,
                address: op.contract.address,
                name: op.contract.name
              },
              timeStamp: doc.timeStamp,
              value: op.value,
              to: op.to,
              from: op.from,
              txHash: doc._id,
              txStatus: "success",
              network
            };
            transactions.push(tokenTx);
          });

        // eth transaction
        const ethTx = {
          transactionId: doc._id,
          asset: {
            symbol: "ETH",
            decimals: 18,
            address: null,
            name: "Ethereum"
          },
          timeStamp: doc.timeStamp,
          value: doc.value,
          to: doc.to,
          from: doc.from,
          txHash: doc._id,
          txStatus: doc.error ? "error" : "success",
          network
        };
        transactions.push(ethTx);
      }
    });
  }

  return transactions;
};
