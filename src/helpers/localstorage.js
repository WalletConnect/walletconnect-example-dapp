/**
 * @desc save to local storage
 * @param  {String}  [key='']
 * @param  {Object}  [data={}]
 * @param  {String} [version=defaultVersion]
 */
export const saveLocal = (key = '', data = {}) => {
  const jsonData = JSON.stringify(data);
  localStorage.setItem(key, jsonData);
};

/**
 * @desc get from local storage
 * @param  {String}  [key='']
 * @return {Object}
 */
export const getLocal = (key = '') => {
  const data = localStorage.getItem(key)
    ? JSON.parse(localStorage.getItem(key))
    : null;
  return data;
};

/**
 * @desc get from local storage
 * @param  {String}  [key='']
 * @return {Object}
 */
export const removeLocal = (key = '') => localStorage.removeItem(key);

/**
 * @desc get from local storage
 * @param  {String}  [key='']
 * @param  {Array}  [data=[]]
 * @return {Void}
 */
export const updateLocal = (key = '', data = []) => {
  const localData = getLocal(key) || [];
  const mergedData = [...localData, ...data];
  saveLocal(key, mergedData);
};
