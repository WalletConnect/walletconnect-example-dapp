import { providers, utils, Contract } from "ethers";

const spec = {
  legacy: {
    magicValue: "0x1626ba7e",
    abi: [
      {
        constant: true,
        inputs: [
          {
            name: "_data",
            type: "bytes32",
          },
          {
            name: "_sig",
            type: "bytes",
          },
        ],
        name: "isValidSignature",
        outputs: [
          {
            name: "magicValue",
            type: "bytes4",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
  },
  current: {
    magicValue: "0x20c13b0b",
    abi: [
      {
        constant: true,
        inputs: [
          {
            name: "_data",
            type: "bytes",
          },
          {
            name: "_sig",
            type: "bytes",
          },
        ],
        name: "isValidSignature",
        outputs: [
          {
            name: "magicValue",
            type: "bytes4",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
  },
};

async function _isValidSignature(
  address: string,
  sig: string,
  data: string,
  provider: providers.Provider,
  abi = eip1271.spec.current.abi,
  magicValue = eip1271.spec.current.magicValue,
): Promise<boolean> {
  let returnValue;
  try {
    returnValue = await new Contract(address, abi, provider).isValidSignature(
      utils.arrayify(data),
      sig,
    );
  } catch (e) {
    return false;
  }
  return returnValue.toLowerCase() === magicValue.toLowerCase();
}

async function isValidSignature(
  address: string,
  sig: string,
  data: string,
  provider: providers.Provider,
): Promise<boolean> {
  let result = await _isValidSignature(address, sig, data, provider);
  if (!result) {
    result = await _isValidSignature(
      address,
      sig,
      data,
      provider,
      eip1271.spec.legacy.abi,
      eip1271.spec.legacy.magicValue,
    );
  }
  return result;
}

export const eip1271 = {
  spec,
  isValidSignature,
};
