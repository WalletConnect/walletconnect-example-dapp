import { getLocal } from "./localstorage";

/**
 * @desc debounce api request
 * @param  {Function}  request
 * @param  {Array}     params
 * @param  {Number}    timeout
 * @return {Promise}
 */
export const debounceRequest = (request, params, timeout) =>
  new Promise((resolve, reject) =>
    setTimeout(
      () =>
        request(...params)
          .then(res => {
            resolve(res);
          })
          .catch(err => reject(err)),
      timeout
    )
  );

/**
 * @desc capitalize string
 * @param  {String} [string]
 * @return {String}
 */
export const capitalize = string =>
  string
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

/**
 * @desc ellipse text to max maxLength
 * @param  {String}  [text = '']
 * @param  {Number}  [maxLength = 9999]
 * @return {String}
 */
export const ellipseText = (text = "", maxLength = 9999) => {
  if (text.length <= maxLength) return text;
  const _maxLength = maxLength - 3;
  let ellipse = false;
  let currentLength = 0;
  const result =
    text
      .split(" ")
      .filter(word => {
        currentLength += word.length;
        if (ellipse || currentLength >= _maxLength) {
          ellipse = true;
          return false;
        } else {
          return true;
        }
      })
      .join(" ") + "...";
  return result;
};

/**
 * @desc ellipse public address
 * @param  {String}  [address = '']
 * @return {String}
 */
export const ellipseAddress = (address = "") =>
  `${address.slice(0, 10)}...${address.slice(-10)}`;

/**
 * @desc pad string to specific width and padding
 * @param  {String} n
 * @param  {Number} width
 * @param  {String} z
 * @return {String}
 */
export const padLeft = (n, width, z) => {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

/**
 * @desc sanitize hexadecimal string
 * @param  {String} address
 * @return {String}
 */
export const sanitizeHex = hex => {
  hex = hex.substring(0, 2) === "0x" ? hex.substring(2) : hex;
  if (hex === "") return "";
  hex = hex.length % 2 !== 0 ? "0" + hex : hex;
  return "0x" + hex;
};

/**
 * @desc remove hex prefix
 * @param  {String} hex
 * @return {String}
 */
export const removeHexPrefix = hex => hex.toLowerCase().replace("0x", "");

/**
 * @desc get ethereum contract call data string
 * @param  {String} func
 * @param  {Array}  arrVals
 * @return {String}
 */
export const getDataString = (func, arrVals) => {
  let val = "";
  for (let i = 0; i < arrVals.length; i++) val += padLeft(arrVals[i], 64);
  const data = func + val;
  return data;
};

/**
 * @desc returns url parameter value
 * @param  {String} parameter
 * @param  {String} url
 * @return {String}
 */
export const getUrlParameter = (
  parameter,
  url = typeof window !== "undefined" ? window.location.href : ""
) => {
  let name = parameter.replace(/[[]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

/**
 * @desc parse error code message
 * @param  {Error} error
 * @return {String}
 */
export const parseError = error => {
  const generic_error = "Something went wrong!";

  if (error) {
    const msgEnd =
      error.message.indexOf("\n") !== -1
        ? error.message.indexOf("\n")
        : error.message.length;
    let message = error.message.slice(0, msgEnd);
    if (message.indexOf("0x6801") !== -1) {
      message = generic_error;
    }
    console.error(error);
    return message;
  }
  return generic_error;
};

/**
 * @desc format  domain
 * @param  {String}  name
 * @return {String}
 */
export const formatDomain = name => {
  if (name.endsWith(".eth")) {
    return name;
  } else return name + ".eth";
};

/**
 * @desc converts label hash to domain
 * @param   {String}  labelHash
 * @return  {String}
 */
export const getLocalDomainFromLabelHash = (labelHash = "") => {
  const localDomains = getLocal("domains") || [];
  const savedData = localDomains.filter(
    domainData => domainData.labelHash === labelHash
  );
  let domain = "";
  if (savedData.length) {
    domain = savedData[0].domain;
  }
  return domain;
};
