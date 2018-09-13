import { toChecksumAddress } from "./web3";

/**
 * @desc validate email
 * @param  {string}  email
 * @return {Boolean}
 */
export const isValidEmail = email =>
  !!email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

/**
 * @desc validate ethereum address
 * @param  {Number} wei
 * @return {Boolean}
 */
export const isValidAddress = address => {
  if (address.substring(0, 2) !== "0x") return false;
  else if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) return false;
  else if (
    /^(0x)?[0-9a-f]{40}$/.test(address) ||
    /^(0x)?[0-9A-F]{40}$/.test(address)
  )
    return true;
  else return address === toChecksumAddress(address);
};
