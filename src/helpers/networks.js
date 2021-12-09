export const networkConfigs = {
  "0x2a": {
    chainName: "Kovan",
    currencyName: "ETH",
    currencySymbol: "ETH",
    rpcUrl: `https://speedy-nodes-nyc.moralis.io/${process.env.REACT_APP_MORALIS_SPEEDY_NODES_KEY}/eth/kovan`,
    blockExplorerUrl: "https://kovan.etherscan.io/",
  },
  "0xa869": {
    chainId: 43113,
    chainName: "Avalanche Fuji",
    currencyName: "AVAX",
    currencySymbol: "AVAX",
    rpcUrl: `https://speedy-nodes-nyc.moralis.io/${process.env.REACT_APP_MORALIS_SPEEDY_NODES_KEY}/avalanche/testnet`,
    blockExplorerUrl: "https://testnet.snowtrace.io/",
  },
  "0x61": {
    chainId: 97,
    chainName: "Smart Chain - Testnet",
    currencyName: "BNB",
    currencySymbol: "BNB",
    rpcUrl: `https://speedy-nodes-nyc.moralis.io/${process.env.REACT_APP_MORALIS_SPEEDY_NODES_KEY}/bsc/testnet`,
    blockExplorerUrl: "https://testnet.bscscan.com/",
  },
  "0x13881": {
    chainId: 80001,
    chainName: "Mumbai",
    currencyName: "MATIC",
    currencySymbol: "MATIC",
    rpcUrl: `https://speedy-nodes-nyc.moralis.io/${process.env.REACT_APP_MORALIS_SPEEDY_NODES_KEY}/polygon/mumbai`,
    blockExplorerUrl: "https://mumbai.polygonscan.com/",
  },
};

export const getNativeByChain = (chain) =>
  networkConfigs[chain]?.currencySymbol || "NATIVE";

export const getChainById = (chain) => networkConfigs[chain]?.chainId || null;

export const getExplorer = (chain) => networkConfigs[chain]?.blockExplorerUrl;

export const getWrappedNative = (chain) =>
  networkConfigs[chain]?.wrapped || null;
