import WalletConnect from "walletconnect";

const defaultConfig = {
  bridgeUrl: "https://test-bridge.walletconnect.org",
  dappName: "Example Dapp"
};

export let webConnector = new WalletConnect(defaultConfig);

/**
 * @desc Initiate WalletConnect Session
 * @return {Object}
 */
export async function walletConnectInitSession() {
  try {
    await webConnector.initSession();
    window.webConnector = webConnector;
    console.log("webConnector", webConnector);
  } catch (error) {
    console.error(error);
  }
}

/**
 * @desc Get WalletConnect Accounts
 * @return {Array}
 */
export function walletConnectGetAccounts() {
  return webConnector.accounts;
}

/**
 * @desc Get WalletConnect URI string
 * @return {String}
 */
export function walletConnectGetURI() {
  return webConnector.uri;
}

/**
 * @desc Listen to WalletConnect Session Status and Get Accounts
 * @return {Object}
 */
export async function walletConnectListenSessionStatus() {
  try {
    await webConnector.listenSessionStatus(); // Listen to session status
  } catch (error) {
    console.error(error);
  }
}

/**
 * @desc Send Transaction
 * @return {Object}
 */
export async function walletConnectSendTransaction(tx) {
  try {
    // Submitted Transaction Hash
    const result = await webConnector.sendTransaction(tx);
    return result;
  } catch (error) {
    // Rejected Transaction
    console.error(error);
    return null;
  }
}

/**
 * @desc Sign Message
 * @return {Object}
 */
export async function walletConnectSignMessage(msg) {
  try {
    // Submitted Transaction Hash
    const result = await webConnector.signMessage(msg);
    return result;
  } catch (error) {
    // Rejected Signing
    console.error(error);
    return null;
  }
}

/**
 * @desc Sign Typed Data
 * @return {Object}
 */
export async function walletConnectSignTypedData(msgParams) {
  try {
    // Signed typed data
    const result = await webConnector.signTypedData(msgParams);
    return result;
  } catch (error) {
    // Rejected Signing
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
