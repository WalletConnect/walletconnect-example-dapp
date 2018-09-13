import BigNumber from "bignumber.js";

/**
 * @desc count value's number of decimals places
 * @param  {String}   value
 * @return {String}
 */
export const countDecimalPlaces = value => BigNumber(`${value}`).dp();

/**
 * @desc convert from number to string
 * @param  {Number}  value
 * @return {String}
 */
export const convertNumberToString = value => BigNumber(`${value}`).toString();

/**
 * @desc convert from string to number
 * @param  {String}  value
 * @return {Number}
 */
export const convertStringToNumber = value => BigNumber(`${value}`).toNumber();

/**
 * @desc convert hex to number string
 * @param  {String} hex
 * @return {String}
 */
export const convertHexToString = hex => BigNumber(`${hex}`).toString();

/**
 * @desc convert number to string to hex
 * @param  {String} string
 * @return {String}
 */
export const convertStringToHex = string => BigNumber(`${string}`).toString(16);

/**
 * @desc compares if numberOne is greater than numberTwo
 * @param  {Number}   numberOne
 * @param  {Number}   numberTwo
 * @return {String}
 */
export const greaterThan = (numberOne, numberTwo) =>
  BigNumber(`${numberOne}`).comparedTo(BigNumber(`${numberTwo}`)) === 1;

/**
 * @desc compares if numberOne is greater than or equal to numberTwo
 * @param  {Number}   numberOne
 * @param  {Number}   numberTwo
 * @return {String}
 */
export const greaterThanOrEqual = (numberOne, numberTwo) =>
  BigNumber(`${numberOne}`).comparedTo(BigNumber(`${numberTwo}`)) >= 0;

/**
 * @desc compares if numberOne is smaller than numberTwo
 * @param  {Number}   numberOne
 * @param  {Number}   numberTwo
 * @return {String}
 */
export const smallerThan = (numberOne, numberTwo) =>
  BigNumber(`${numberOne}`).comparedTo(BigNumber(`${numberTwo}`)) === -1;

/**
 * @desc compares if numberOne is smaller than or equal to numberTwo
 * @param  {Number}   numberOne
 * @param  {Number}   numberTwo
 * @return {String}
 */
export const smallerThanOrEqual = (numberOne, numberTwo) =>
  BigNumber(`${numberOne}`).comparedTo(BigNumber(`${numberTwo}`)) <= 0;

/**
 * @desc multiplies two numbers
 * @param  {Number}   numberOne
 * @param  {Number}   numberTwo
 * @return {String}
 */
export const multiply = (numberOne, numberTwo) =>
  BigNumber(`${numberOne}`)
    .times(BigNumber(`${numberTwo}`))
    .toString();

/**
 * @desc divides two numbers
 * @param  {Number}   numberOne
 * @param  {Number}   numberTwo
 * @return {String}
 */
export const divide = (numberOne, numberTwo) =>
  BigNumber(`${numberOne}`)
    .dividedBy(BigNumber(`${numberTwo}`))
    .toString();

/**
 * @desc real floor divides two numbers
 * @param  {Number}   numberOne
 * @param  {Number}   numberTwo
 * @return {String}
 */
export const floorDivide = (numberOne, numberTwo) =>
  BigNumber(`${numberOne}`)
    .dividedToIntegerBy(BigNumber(`${numberTwo}`))
    .toString();

/**
 * @desc modulos of two numbers
 * @param  {Number}   numberOne
 * @param  {Number}   numberTwo
 * @return {String}
 */
export const mod = (numberOne, numberTwo) =>
  BigNumber(`${numberOne}`)
    .mod(BigNumber(`${numberTwo}`))
    .toString();

/**
 * @desc adds two numbers
 * @param  {Number}   numberOne
 * @param  {Number}   numberTwo
 * @return {String}
 */
export const add = (numberOne, numberTwo) =>
  BigNumber(`${numberOne}`)
    .plus(BigNumber(`${numberTwo}`))
    .toString();

/**
 * @desc subtracts two numbers
 * @param  {Number}   numberOne
 * @param  {Number}   numberTwo
 * @return {String}
 */
export const subtract = (numberOne, numberTwo) =>
  BigNumber(`${numberOne}`)
    .minus(BigNumber(`${numberTwo}`))
    .toString();

/**
 * @desc convert from amount value to raw number format
 * @param  {String|Number}  value
 * @return {BigNumber}
 */
export const convertAmountToRawNumber = (value, decimals = 18) =>
  BigNumber(`${value}`)
    .times(BigNumber("10").pow(decimals))
    .toString();

/**
 * @desc convert to amount value from raw number format
 * @param  {BigNumber}  value
 * @return {String}
 */
export const convertAmountFromRawNumber = (value, decimals = 18) =>
  BigNumber(`${value}`)
    .dividedBy(BigNumber("10").pow(decimals))
    .toString();

/**
 * @desc handle signficant decimals in display format
 * @param  {String}   value
 * @param  {Number}   decimals
 * @param  {Number}   buffer
 * @return {String}
 */
export const handleSignificantDecimals = (value, decimals, buffer) => {
  if (
    !BigNumber(`${decimals}`).isInteger() ||
    (buffer && !BigNumber(`${buffer}`).isInteger())
  )
    return null;
  buffer = buffer ? convertStringToNumber(buffer) : 3;
  decimals = convertStringToNumber(decimals);
  if (smallerThan(BigNumber(`${value}`).abs(), 1)) {
    decimals =
      value
        .slice(2)
        .slice("")
        .search(/[^0]/g) + buffer;
    decimals = decimals < 8 ? decimals : 8;
  } else {
    decimals = decimals < buffer ? decimals : buffer;
  }
  let result = BigNumber(`${value}`).toFixed(decimals);
  result = BigNumber(`${result}`).toString();
  return BigNumber(`${result}`).dp() <= 2
    ? BigNumber(`${result}`).toFormat(2)
    : BigNumber(`${result}`).toFormat();
};

/**
 * @desc format fixed number of decimals
 * @param  {String}   value
 * @param  {Number}   decimals
 * @return {String}
 */
export const formatFixedDecimals = (value, decimals) => {
  const _value = convertNumberToString(value);
  const _decimals = convertStringToNumber(decimals);
  const result = BigNumber(BigNumber(_value).toFixed(_decimals)).toString();
  return result;
};

/**
 * @desc format inputOne value to signficant decimals given inputTwo
 * @param  {String}   inputOne
 * @param  {String}   inputTwo
 * @return {String}
 */
export const formatInputDecimals = (inputOne, inputTwo) => {
  const _nativeAmountDecimalPlaces = countDecimalPlaces(inputTwo);
  const decimals =
    _nativeAmountDecimalPlaces > 8 ? _nativeAmountDecimalPlaces : 8;
  const result = BigNumber(formatFixedDecimals(inputOne, decimals))
    .toFormat()
    .replace(/,/g, "");
  return result;
};
