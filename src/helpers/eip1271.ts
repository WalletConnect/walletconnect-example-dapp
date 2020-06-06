import { providers, utils, Contract } from "ethers";

const magicValue = "0x20c13b0b";

const abi = [
  {
    constant: true,
    inputs: [
      {
        name: "_messageHash",
        type: "bytes",
      },
      {
        name: "_signature",
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
];

async function isValidSignature(
  address: string,
  sig: string,
  hash: string,
  provider: providers.Provider,
): Promise<boolean> {
  const contract = new Contract(address, eip1271.abi, provider);

  let returnValue;
  try {
    returnValue = await contract.isValidSignature(utils.arrayify(hash), sig);
  } catch (e) {
    return false;
  }

  return returnValue.toLowerCase() === magicValue.toLowerCase();
}

export const eip1271 = {
  abi,
  magicValue,
  isValidSignature,
};
