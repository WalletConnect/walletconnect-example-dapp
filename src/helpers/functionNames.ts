interface IFunctionNamesDict {
  [hash: string]: string;
}

const functionNames: IFunctionNamesDict = {
  0xa9059cbb: "Transfer",
  0x363349be: "FillOrdersUpTo",
  0x42966c68: "Burn",
  0x454a2ab3: "Bid",
  0x4f150787: "BatchFillOrKillOrders",
  0x23b872dd: "TransferFrom",
  0xd0e30db0: "Deposit",
  0x095ea7b3: "Approve",
  0x2e1a7d4d: "Withdraw",
  0xbc61394a: "FillOrder",
  0xc01a8c84: "ConfirmTransaction"
};

export default functionNames;
