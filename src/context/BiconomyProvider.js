import { createContext, useEffect, useState, useMemo } from "react";
import { useChain, useMoralis } from "react-moralis";
import { Biconomy } from "@biconomy/mexa";
import Web3 from "web3";
import { networkConfigs } from "helpers/networks";
import simpleStorageContract from "contracts/SimpleStorage.json";
import simpleStorage from "list/simpleStorage.json";

export const BiconomyContext = createContext({});

const BiconomyContextProvider = (props) => {
  const { children } = props;
  const {
    isWeb3Enabled,
    web3,
    isAuthenticated,
    isWeb3EnableLoading,
    enableWeb3,
  } = useMoralis();
  const { chainId } = useChain();
  const [isBiconomyInitialized, setIsBiconomyInitialized] = useState(false);
  const [biconomyProvider, setBiconomyProvider] = useState({});
  const [contract, setContract] = useState({});
  const { abi } = simpleStorageContract;
  const contractAddress = useMemo(() => simpleStorage[chainId], [chainId]);

  useEffect(() => {
    const initializeBiconomy = async () => {
      await enableWeb3();
      const networkProvider = new Web3.providers.HttpProvider(
        networkConfigs[chainId]?.rpcUrl
      );
      const biconomy = new Biconomy(networkProvider, {
        walletProvider: window.ethereum,
        apiKey: process.env.REACT_APP_BICONOMY_API_KEY,
        debug: true,
      });
      setBiconomyProvider(biconomy);

      // This web3 instance is used to read normally and write to contract via meta transactions.
      web3.setProvider(biconomy);

      biconomy
        .onEvent(biconomy.READY, () => {
          setIsBiconomyInitialized(true);
          const contractInst = new web3.eth.Contract(abi, contractAddress);
          setContract(contractInst);
        })
        .onEvent(biconomy.ERROR, () => {
          // Handle error while initializing mexa
        });
    };

    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading && chainId) {
      initializeBiconomy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled, chainId]);

  return (
    <BiconomyContext.Provider
      value={{ isBiconomyInitialized, biconomyProvider, contract }}
    >
      {children}
    </BiconomyContext.Provider>
  );
};

export default BiconomyContextProvider;
