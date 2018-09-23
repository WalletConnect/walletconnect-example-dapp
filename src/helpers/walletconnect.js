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
export async function walletConnectInitSession() {
  try {
    const session = await webConnector.initSession();
    return session;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * @desc Listen to WalletConnect Session Status and Get Accounts
 * @return {Object}
 */
export async function walletConnectGetAccounts() {
  try {
    const result = await webConnector.listenSessionStatus(); // Listen to session status
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * @desc WalletConnect sign transaction
 * @param  {Object}  transaction { from, to, data, value, gasPrice, gasLimit }
 * @return {String}
 */
export async function walletConnectSignTransaction(transaction) {
  try {
    const transactionId = await webConnector.createTransaction(transaction);
    const data = await walletConnectGetTransactionStatus(
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
}

/**
 * @desc Listen to Transation Status Request
 * @return {String}
 */
export async function walletConnectGetTransactionStatus(transactionId) {
  const transactionStatus = await webConnector.listenTransactionStatus(
    transactionId
  );

  if (transactionStatus.success) {
    const { txHash } = transactionStatus; // Get transaction hash
    return txHash;
  } else {
    return "";
  }
}

/**
 * @desc Initiate WalletConnect Session
 * @return {Object}
 */
export async function walletConnectResetSession() {
  webConnector = new WalletConnect(defaultConfig);
}
