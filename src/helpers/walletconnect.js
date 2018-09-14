import WalletConnect from "walletconnect";

const defaultConfig = {
  bridgeUrl: "https://bridge.walletconnect.org",
  dappName: "Example Dapp"
};

export let webConnector = new WalletConnect(defaultConfig);

/**
 * @desc Initiate WalletConnect Session
 * @return {Object}
 */
export const walletConnectInitSession = async () => {
  try {
    const session = await webConnector.initSession();
    console.log("webConnector", webConnector);
    return session;
  } catch (error) {
    console.log("webConnector", webConnector);
    console.error(error);
    return null;
  }
};

/**
 * @desc Listen to WalletConnect Session Status and Get Accounts
 * @return {Object}
 */
export const walletConnectGetAccounts = async () => {
  try {
    const sessionStatus = await webConnector.listenSessionStatus(); // Listen to session status
    console.log("sessionStatus", sessionStatus);
    const accounts = sessionStatus.data; // Get wallet accounts
    return accounts;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * @desc WalletConnect sign transaction
 * @param  {Object}  transaction { from, to, data, value, gasPrice, gasLimit }
 * @return {String}
 */
export const walletConnectSignTransaction = async transaction => {
  try {
    const transactionId = await webConnector.createTransaction(transaction);
    const data = await walletConnectListenTransactionStatus(
      webConnector,
      transactionId.transactionId
    );
    if (data) {
      const transactionSentSuccess = data.success;
      if (transactionSentSuccess) {
        const transactionHash = data.txHash;
        return transactionHash;
      } else {
        return null;
      }
    }
    return null;
  } catch (error) {
    // TODO: error handling
  }
};

/**
 * @desc Listen to Transation Status Request
 * @return {String}
 */
export const walletConnectListenTransactionStatus = async transactionId => {
  const transactionStatus = await webConnector.listenTransactionStatus(
    transactionId
  );

  if (transactionStatus.success) {
    const { txHash } = transactionStatus; // Get transaction hash
    return txHash;
  } else {
    return "";
  }
};

/**
 * @desc Initiate WalletConnect Session
 * @return {Object}
 */
export const walletConnectRemoveSession = async () => {
  webConnector = new WalletConnect(defaultConfig);
  return webConnector;
};
