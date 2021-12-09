import {
  Card,
  // Form,
  Typography,
  Skeleton /*notification*/,
  Button,
} from "antd";
import { useEffect, useMemo } from "react";
import simpleStorageContract from "contracts/SimpleStorage.json";
import Address from "components/Address/Address";
import { useMoralis, useChain } from "react-moralis";
import simpleStorage from "list/simpleStorage.json";
import { useAPIContract } from "hooks/useAPIContract";
import useBiconomyContext from "hooks/useBiconomyContext";

export default function Contract() {
  const { isInitialized, isWeb3Enabled, account } = useMoralis();
  const { chainId } = useChain();
  const { biconomyProvider, contract } = useBiconomyContext();
  const { contractName, abi } = simpleStorageContract;

  const contractAddress = useMemo(() => simpleStorage[chainId], [chainId]);

  const { runContractFunction, contractResponse, isLoading } = useAPIContract();

  const metaTransactionTest = () => {
    try {
      let tx = contract.methods.setStorage("Hello Web3").send({
        from: account,
        signatureType: biconomyProvider.EIP712_SIGN,
      });

      tx.on("transactionHash", function (hash) {
        console.log(`Transaction hash is ${hash}`);
        alert(`Transaction sent. Waiting for confirmation ..`);
      })
        .once("confirmation", function (_, receipt) {
          console.log(receipt);
          alert("Transaction confirmed on chain");
          runContractFunction({
            params: {
              chain: chainId,
              function_name: "getStorage",
              abi,
              address: contractAddress,
            },
          });
        })
        .on("error", function (error, receipt) {
          console.log(error);
        });
    } catch (err) {
      console.log("handle errors like signature denied here");
      console.log(err);
    }
  };

  useEffect(() => {
    if (isInitialized && isWeb3Enabled) {
      runContractFunction({
        params: {
          chain: chainId,
          function_name: "getStorage",
          abi,
          address: contractAddress,
        },
      });
    }
  }, [
    isInitialized,
    isWeb3Enabled,
    runContractFunction,
    contractAddress,
    abi,
    chainId,
  ]);

  return (
    <Card
      size="large"
      style={{
        minWidth: "60vw",
        boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
        border: "1px solid #e7eaf3",
        borderRadius: "0.5rem",
      }}
    >
      {/* <Form
        name="basic"
        initialValues={{ remember: true }}
        // onFinish={metaTransactionTest}
        autoComplete="off"
      > */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
          padding: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography.Title style={{ margin: 0 }}>
            {contractName}
          </Typography.Title>
          <Address copyable address={contractAddress} size={8} />
        </div>
        {isLoading ? (
          <Skeleton />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography.Text style={{ fontSize: "16px" }}>
              Storage
            </Typography.Text>
            <Typography.Text style={{ fontSize: "25px" }}>
              {contractResponse}
            </Typography.Text>
          </div>
        )}
        <Button
          type="primary"
          shape="round"
          size="large"
          // htmlType="submit"
          style={{ width: "100%", maxWidth: "280px" }}
          onClick={metaTransactionTest}
        >
          Set Storage
        </Button>
      </div>
      {/* </Form> */}
    </Card>
  );
}
