const example = {
  types: {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ],
    Permit: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  },
  domain: {
    name: "Liquid staked Ether 2.0",
    version: "2",
    chainId: 1,
    verifyingContract: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
  },
  primaryType: "Permit",
  message: {
    owner: "0x01Badd833a247cABf0c2da49a61d06eCb1b7E993",
    spender: "0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1",
    value: "10000978944812",
    nonce: "0x0",
    deadline: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
  },
};

export const eip712 = {
  example,
};
