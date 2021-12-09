/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useEffect, useState, useMemo } from "react";
import { useChain, useMoralis } from "react-moralis";
import { Biconomy } from "@biconomy/mexa";
import Web3 from "web3";
import { notification } from "antd";
import { networkConfigs } from "helpers/networks";
import simpleStorageContract from "contracts/SimpleStorage.json";
import simpleStorage from "list/simpleStorage.json";
import biconomyApiKey from "helpers/biconomy";

export const BiconomyContext = createContext({});

const BiconomyContextProvider = (props) => {
  const { children } = props;
  const {
    isWeb3Enabled,
    web3,
    isAuthenticated,
    isWeb3EnableLoading,
    enableWeb3,
    Moralis,
  } = useMoralis();
  const { chainId } = useChain();
  const [isBiconomyInitialized, setIsBiconomyInitialized] = useState(false);
  const [biconomyProvider, setBiconomyProvider] = useState({});
  const [contract, setContract] = useState({});
  const { abi } = simpleStorageContract;
  const contractAddress = useMemo(() => simpleStorage[chainId], [chainId]);

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading && chainId) {
      enableWeb3();
    }
  }, [isAuthenticated, isWeb3Enabled, chainId]);

  useEffect(() => {
    const initializeBiconomy = async () => {
      if (isBiconomyInitialized) {
        // Resetting when reinitializing
        setIsBiconomyInitialized(false);
      }

      const walletWeb3 = await Moralis.enableWeb3();
      const networkProvider = new Web3.providers.HttpProvider(
        networkConfigs[chainId]?.rpcUrl
      );
      const biconomy = new Biconomy(networkProvider, {
        walletProvider: walletWeb3.currentProvider,
        apiKey: biconomyApiKey[chainId],
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
          notification.error({
            message: "Biconomy Initialization Fail",
            description:
              "Biconomy has failed to initialized. Please try again later.",
          });
        });
    };

    if (isAuthenticated && isWeb3Enabled && chainId !== "0x1") {
      initializeBiconomy();
    }
  }, [
    isAuthenticated,
    isWeb3Enabled,
    chainId,
    web3,
    abi,
    contractAddress,
    Moralis,
  ]);

  return (
    <BiconomyContext.Provider
      value={{ isBiconomyInitialized, biconomyProvider, contract }}
    >
      {children}
    </BiconomyContext.Provider>
  );
};

export default BiconomyContextProvider;
