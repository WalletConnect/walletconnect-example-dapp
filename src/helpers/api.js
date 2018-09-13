import axios from "axios";

/**
 * Configuration for balance api
 * @type axios instance
 */
const api = axios.create({
  baseURL: "https://indexer.balance.io",
  timeout: 30000, // 30 secs
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});

/**
 * @desc get account balances
 * @param  {String}   [address = '']
 * @param  {String}   [network = 'mainnet']
 * @return {Promise}
 */
export const apiGetAccountBalances = async (
  address = "",
  network = "mainnet"
) => api.get(`/get_balances/${network}/${address}`);

/**
 * @desc get account transactions
 * @param  {String}   [address = '']
 * @param  {String}   [network = 'mainnet']
 * @param  {Number}   [page = 1]
 * @return {Promise}
 */
export const apiGetAccountTransactions = (
  address = "",
  network = "mainnet",
  page = 1
) => api.get(`/get_transactions/${network}/${address}/${page}`);

/**
 * @desc get transaction details
 * @param  {String}   [txnHash = '']
 * @param  {String}   [network = 'mainnet']
 * @return {Promise}
 */
export const apiGetTransactionDetails = (txnHash = "", network = "mainnet") =>
  api.get(`/get_transaction/${network}/${txnHash}`);

/**
 * @desc get ethereum gas prices
 * @return {Promise}
 */
export const apiGetGasPrices = () => api.get(`/get_eth_gas_prices`);
