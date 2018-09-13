import Web3 from "web3";
import { isValidAddress } from "../helpers/validators";
import { getDataString, removeHexPrefix } from "../helpers/utilities";
import {
  convertStringToNumber,
  convertNumberToString,
  convertAmountToRawNumber,
  convertAssetAmountFromRawNumber,
  convertStringToHex,
  convertAmountToAssetAmount
} from "../helpers/bignumber";

/**
 * @desc web3 http instance
 */
export const web3Instance = new Web3(
  new Web3.providers.HttpProvider(`https://mainnet.infura.io/`)
);

web3Instance.eth.getTransactionReceiptMined = getTransactionReceiptMined;

/**
 * @desc set a different web3 provider
 * @param {String}
 */
export const web3SetHttpProvider = provider => {
  let providerObj = null;
  if (provider.match(/(https?:\/\/)(\w+.)+/g)) {
    providerObj = new Web3.providers.HttpProvider(provider);
  }
  if (!providerObj) {
    throw new Error(
      "function web3SetHttpProvider requires provider to match a valid HTTP/HTTPS endpoint"
    );
  }
  return web3Instance.setProvider(providerObj);
};

/**
 * @desc convert to checksum address
 * @param  {String} address
 * @return {String}
 */
export const toChecksumAddress = address => {
  if (typeof address === "undefined") return "";

  address = address.toLowerCase().replace("0x", "");
  const addressHash = web3Instance.utils.sha3(address).replace("0x", "");
  let checksumAddress = "0x";

  for (let i = 0; i < address.length; i++) {
    if (parseInt(addressHash[i], 16) > 7) {
      checksumAddress += address[i].toUpperCase();
    } else {
      checksumAddress += address[i];
    }
  }
  return checksumAddress;
};

/**
 * @desc convert from wei to ether
 * @param  {Number} wei
 * @return {BigNumber}
 */
export const fromWei = wei => web3Instance.utils.fromWei(wei);

/**
 * @desc convert from ether to wei
 * @param  {Number} ether
 * @return {BigNumber}
 */
export const toWei = ether => web3Instance.utils.toWei(ether);

/**
 * @desc hash string with sha3
 * @param  {String} string
 * @return {String}
 */
export const sha3 = string => web3Instance.utils.sha3(string);

/**
 * @desc get address transaction count
 * @param {String} address
 * @return {Promise}
 */
export const getTransactionCount = address =>
  web3Instance.eth.getTransactionCount(address, "pending");

/**
 * @desc get transaction by hash
 * @param   {String}  hash
 * @return  {Promise}
 */
export const getTransactionByHash = hash =>
  web3Instance.eth.getTransaction(hash);

/**
 * @desc get block by hash
 * @param   {String}  hash
 * @return  {Promise}
 */
export const getBlockByHash = hash => web3Instance.eth.getBlock(hash);

/**
 * @desc get account ether balance
 * @param  {String} accountAddress
 * @param  {String} tokenAddress
 * @return {Array}
 */
export const getAccountBalance = async address => {
  const wei = await web3Instance.eth.getBalance(address);
  const ether = fromWei(wei);
  const balance =
    convertStringToNumber(ether) !== 0 ? convertNumberToString(ether) : 0;
  return balance;
};

/**
 * @desc get transaction details
 * @param  {Object} transaction { from, to, data, value, gasPrice, gasLimit }
 * @return {Object}
 */
export const getTxDetails = async ({
  from,
  to,
  data,
  value,
  gasPrice,
  gasLimit
}) => {
  const _gasPrice = gasPrice || (await web3Instance.eth.getGasPrice());
  const estimateGasData = value === "0x00" ? { from, to, data } : { to, data };
  const _gasLimit =
    gasLimit || (await web3Instance.eth.estimateGas(estimateGasData));
  const nonce = await getTransactionCount(from);
  const tx = {
    from: from,
    to: to,
    nonce: web3Instance.utils.toHex(nonce),
    gasPrice: web3Instance.utils.toHex(_gasPrice),
    gasLimit: web3Instance.utils.toHex(_gasLimit),
    gas: web3Instance.utils.toHex(_gasLimit),
    value: web3Instance.utils.toHex(value),
    data: data
  };
  return tx;
};

/**
 * @desc get transfer token transaction
 * @param  {Object}  transaction { asset, from, to, amount, gasPrice }
 * @return {Object}
 */
export const getTransferTokenTransaction = transaction => {
  const transferMethodHash = "0xa9059cbb";
  const value = convertStringToHex(
    convertAmountToAssetAmount(transaction.amount, transaction.asset.decimals)
  );
  const recipient = removeHexPrefix(transaction.to);
  const dataString = getDataString(transferMethodHash, [recipient, value]);
  return {
    from: transaction.from,
    to: transaction.asset.address,
    data: dataString,
    gasPrice: transaction.gasPrice,
    gasLimit: transaction.gasLimit
  };
};

/**
 * @desc send signed transaction
 * @param  {String}  signedTx
 * @return {Promise}
 */
export const web3SendSignedTransaction = signedTx =>
  new Promise((resolve, reject) => {
    const serializedTx = typeof signedTx === "string" ? signedTx : signedTx.raw;
    web3Instance.eth
      .sendSignedTransaction(serializedTx)
      .once("transactionHash", txHash => resolve(txHash))
      .catch(error => reject(error));
  });

/**
 * @desc web3 send transaction
 * @param  {Object}  transaction { from, to, value, data, gasPrice}
 * @return {Promise}
 */
export const web3SendTransaction = (web3, transaction) =>
  new Promise((resolve, reject) => {
    const from =
      transaction.from.substr(0, 2) === "0x"
        ? transaction.from
        : `0x${transaction.from}`;
    const to =
      transaction.to.substr(0, 2) === "0x"
        ? transaction.to
        : `0x${transaction.to}`;
    const value = transaction.value ? toWei(transaction.value) : "0x00";
    const data = transaction.data ? transaction.data : "0x";
    getTxDetails({
      from,
      to,
      data,
      value,
      gasLimit: transaction.gasLimit
    })
      .then(txDetails => {
        if (typeof web3 !== "undefined") {
          web3.eth.sendTransaction(txDetails, (err, txHash) => {
            if (err) {
              reject(err);
            }
            resolve(txHash);
          });
        } else {
          throw new Error(`Web3 is not present`);
        }
      })
      .catch(error => reject(error));
  });

export function getTransactionReceiptMined(txHash, interval) {
  const self = this;
  const transactionReceiptAsync = function(resolve, reject) {
    self.getTransactionReceipt(txHash, (error, receipt) => {
      if (error) {
        reject(error);
      } else if (receipt == null) {
        setTimeout(
          () => transactionReceiptAsync(resolve, reject),
          interval ? interval : 500
        );
      } else {
        resolve(receipt);
      }
    });
  };

  if (Array.isArray(txHash)) {
    return Promise.all(
      txHash.map(oneTxHash =>
        self.getTransactionReceiptMined(oneTxHash, interval)
      )
    );
  } else if (typeof txHash === "string") {
    return new Promise(transactionReceiptAsync);
  } else {
    throw new Error("Invalid Type: " + txHash);
  }
}

/**
 * @desc send transaction controller given asset transfered and account type
 * @param {Object} transaction { asset, from, to, amount, gasPrice }
 * @return {Promise}
 */
export const web3SendTransactionMultiWallet = transaction => {
  transaction.value = transaction.amount;
  if (transaction.asset.symbol !== "ETH") {
    transaction = getTransferTokenTransaction(transaction);
  }
  return web3SendTransaction(transaction);
};

/**
 * @desc estimate gas limit
 * @param {Object} [{selected, address, recipient, amount, gasPrice}]
 * @return {String}
 */
export const estimateGasLimit = async ({
  asset,
  address,
  recipient,
  amount
}) => {
  let gasLimit = 21000;
  let data = "0x";
  let _amount =
    amount && Number(amount)
      ? convertAmountToRawNumber(amount)
      : asset.balance.amount * 0.1;
  let _recipient =
    recipient && isValidAddress(recipient)
      ? recipient
      : "0x737e583620f4ac1842d4e354789ca0c5e0651fbb";
  let estimateGasData = { to: _recipient, data };
  if (asset.symbol !== "ETH") {
    const transferMethodHash = "0xa9059cbb";
    let value = convertAssetAmountFromRawNumber(_amount, asset.decimals);
    value = convertStringToHex(value);
    data = getDataString(transferMethodHash, [
      removeHexPrefix(_recipient),
      value
    ]);
    estimateGasData = { from: address, to: asset.address, data, value: "0x0" };
    gasLimit = await web3Instance.eth.estimateGas(estimateGasData);
  }
  return gasLimit;
};

export function namehash(name) {
  const labels = name.split(".");
  if (labels[labels.length - 1] === "") {
    labels.pop();
  }
  if (labels[0] === "") {
    labels.shift();
  }

  return labels
    .reverse()
    .reduce(
      (a, v) =>
        Web3.utils.keccak256(
          Buffer.from(
            a.replace("0x", "") + Web3.utils.keccak256(v).replace("0x", ""),
            "hex"
          )
        ),
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    );
}

export function subnodeHash(...labels) {
  return labels.reduce((a, v) =>
    Web3.utils.keccak256(
      Buffer.from(a.replace("0x", "") + v.replace("0x", ""), "hex")
    )
  );
}

export function nodeFromLabelHash(labelHash) {
  return subnodeHash(namehash(".eth"), labelHash);
}
