import {
  Card,
  Input,
  Typography,
  Skeleton /*notification*/,
  Button,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import simpleStorageContract from "contracts/SimpleStorage.json";
import Address from "components/Address/Address";
import { useMoralis, useChain } from "react-moralis";
import simpleStorage from "list/simpleStorage.json";
import { useAPIContract } from "hooks/useAPIContract";
import useBiconomyContext from "hooks/useBiconomyContext";
import { EditOutlined, CloseOutlined } from "@ant-design/icons";

export default function Contract() {
  const { isInitialized, isWeb3Enabled, account } = useMoralis();
  const { chainId } = useChain();
  const { isBiconomyInitialized, biconomyProvider, contract } =
    useBiconomyContext();
  const { contractName, abi } = simpleStorageContract;
  const [isEdit, setIsEdit] = useState(false);
  const [isMetatransactionProcessing, setIsMetatransactionProcessing] =
    useState(false);
  const [storageValue, setStorageValue] = useState("");
  const contractAddress = useMemo(() => simpleStorage[chainId], [chainId]);

  const { runContractFunction, contractResponse, isLoading } = useAPIContract();

  const onSubmitMetaTransaction = () => {
    try {
      setIsMetatransactionProcessing(true);
      let tx = contract.methods.setStorage(storageValue).send({
        from: account,
        signatureType: biconomyProvider.PERSONAL_SIGN,
      });

      tx.on("transactionHash", function (hash) {
        console.log(`Transaction hash is ${hash}`);
        alert(`Transaction sent. Waiting for confirmation ..`);
      })
        .once("confirmation", function () {
          setIsMetatransactionProcessing(false);
          setIsEdit(false);
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
          setIsMetatransactionProcessing(false);
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
      <form
        onSubmit={async (e) => {
          await e.preventDefault();
          onSubmitMetaTransaction();
        }}
      >
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
          {!contractResponse ? (
            <Skeleton />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Typography.Text style={{ fontSize: "16px" }}>
                Storage
              </Typography.Text>
              <div
                style={{ display: "flex", gap: "20px", alignItems: "center" }}
              >
                {!isEdit ? (
                  <Typography.Text style={{ fontSize: "25px" }}>
                    {contractResponse}
                  </Typography.Text>
                ) : (
                  <Input
                    placeholder="New Storage Data"
                    size="large"
                    value={storageValue}
                    disabled={isMetatransactionProcessing}
                    onChange={(e) => setStorageValue(e.target.value)}
                    style={{ height: "40px" }}
                  />
                )}
                <Button
                  icon={!isEdit ? <EditOutlined /> : <CloseOutlined />}
                  shape="circle"
                  danger={isEdit}
                  disabled={isMetatransactionProcessing}
                  onClick={() => setIsEdit((e) => !e)}
                />
              </div>
            </div>
          )}
          <Button
            type="primary"
            shape="round"
            size="large"
            htmlType="submit"
            loading={
              isBiconomyInitialized &&
              (isLoading || isMetatransactionProcessing)
            }
            disabled={!isBiconomyInitialized}
            style={{ width: "100%", maxWidth: "280px" }}
          >
            Set Storage
          </Button>
        </div>
      </form>
    </Card>
  );
}
