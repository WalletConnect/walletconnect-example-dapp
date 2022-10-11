import { Contract, providers, utils } from "ethers";

const spec = {
  magicValue: "0x1626ba7e",
  abi: [
    {
      constant: true,
      inputs: [
        {
          name: "_hash",
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
};

async function isValidSignature(
  address: string,
  sig: string,
  data: string,
  provider: providers.Provider,
  abi = eip1271.spec.abi,
  magicValue = eip1271.spec.magicValue,
): Promise<boolean> {
  let returnValue;
  try {

    console.log("address")
    console.log(address)
    console.log("utils.arrayify(data)")
    console.log(utils.arrayify(data))
    console.log("sig")
    console.log(sig)
    returnValue = await new Contract(address, abi, provider).isValidSignature(
      utils.arrayify(data),
      sig,
    );
  } catch (e) {
    return false;
  }
  return returnValue.toLowerCase() === magicValue.toLowerCase();
}

export const eip1271 = {
  spec,
  isValidSignature,
};
