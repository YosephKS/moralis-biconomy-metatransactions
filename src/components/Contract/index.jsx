/* eslint-disable react-hooks/exhaustive-deps */
import {
  Card,
  Input,
  Typography,
  Skeleton,
  notification,
  Button,
  Select,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import simpleStorageContract from "contracts/SimpleStorage.json";
import Address from "components/Address/Address";
import { useMoralis, useChain } from "react-moralis";
import simpleStorage from "list/simpleStorage.json";
import { useAPIContract } from "hooks/useAPIContract";
import useBiconomyContext from "hooks/useBiconomyContext";

export default function Contract() {
  const { isInitialized, isWeb3Enabled, account } = useMoralis();
  const { chainId } = useChain();
  const { isBiconomyInitialized, biconomyProvider, contract } =
    useBiconomyContext();
  const { contractName, abi } = simpleStorageContract;
  const [isEdit, setIsEdit] = useState(false);
  const [isMetatransactionProcessing, setIsMetatransactionProcessing] =
    useState(false);
  const initialStorageForm = { value: "", signatureType: "" };
  const [storageForm, setStorageForm] = useState(initialStorageForm);
  const contractAddress = useMemo(() => simpleStorage[chainId], [chainId]);

  const { runContractFunction, contractResponse, isLoading } = useAPIContract();

  const onSubmitMetaTransaction = () => {
    try {
      setIsMetatransactionProcessing(true);
      let tx = contract.methods.setStorage(storageForm.value).send({
        from: account,
        signatureType: biconomyProvider.PERSONAL_SIGN,
      });

      tx.on("transactionHash", function () {})
        .once("confirmation", function () {
          setIsMetatransactionProcessing(false);
          setIsEdit(false);
          setStorageForm(initialStorageForm);
          runContractFunction({
            params: {
              chain: chainId,
              function_name: "getStorage",
              abi,
              address: contractAddress,
            },
            onSuccess: () => {
              notification.success({
                message: "Metatransaction Successful",
                description: `You metatransaction has been successfully executed!`,
              });
            },
          });
        })
        .on("error", function () {
          setIsMetatransactionProcessing(false);
          notification.error({
            message: "Metatransaction Fail",
            description:
              "Your metatransaction has failed. Please try again later.",
          });
        });
    } catch (e) {
      notification.error({
        message: "Metatransaction Fail",
        description: "Your metatransaction has failed. Please try again later.",
      });
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
        onSuccess: () => {
          // Reinitialize everything
          setIsEdit(false);
          setStorageForm(initialStorageForm);
        },
      });
    }
  }, [
    isInitialized,
    isWeb3Enabled,
    contractAddress,
    abi,
    chainId,
    runContractFunction,
  ]);

  return (
    <Card
      size="large"
      style={{
        minWidth: "60vw",
        boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
        border: "1px solid #e7eaf3",
        borderRadius: "0.5rem",
        textAlign: "center",
      }}
    >
      <form
        onSubmit={async (e) => {
          await e.preventDefault();
          if (isEdit) {
            onSubmitMetaTransaction();
          } else {
            setIsEdit(true);
          }
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
                width: "100%",
                maxWidth: "280px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                {!isEdit ? (
                  <>
                    <Typography.Text style={{ fontSize: "16px" }}>
                      Current Storage
                    </Typography.Text>
                    <Typography.Text style={{ fontSize: "25px" }}>
                      {contractResponse}
                    </Typography.Text>
                  </>
                ) : (
                  <>
                    <Typography.Text style={{ fontSize: "16px" }}>
                      Enter New Storage Data
                    </Typography.Text>
                    <Input
                      placeholder="New Storage Data"
                      size="large"
                      value={storageForm.value}
                      disabled={isMetatransactionProcessing}
                      onChange={(e) =>
                        setStorageForm({
                          ...storageForm,
                          value: e.target.value,
                        })
                      }
                      style={{ height: "40px", width: "100%" }}
                    />
                    <Typography.Text style={{ fontSize: "16px" }}>
                      Choose Signature Type
                    </Typography.Text>
                    <Select
                      value={storageForm.signatureType}
                      size="large"
                      style={{ height: "45px", width: "100%" }}
                      onChange={(val) =>
                        setStorageForm({ ...storageForm, signatureType: val })
                      }
                    >
                      <Select.Option value="EIP712">EIP712</Select.Option>
                      <Select.Option value="Personal">Personal</Select.Option>
                    </Select>
                  </>
                )}
              </div>
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
              width: "100%",
            }}
          >
            {isEdit && (
              <Button
                danger
                size="large"
                shape="round"
                style={{ width: "100%", maxWidth: "280px" }}
                disabled={
                  isBiconomyInitialized &&
                  (isLoading || isMetatransactionProcessing)
                }
                onClick={() => {
                  setStorageForm(initialStorageForm);
                  setIsEdit(false);
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              type="primary"
              shape="round"
              size="large"
              htmlType={isEdit && "submit"}
              loading={
                isBiconomyInitialized &&
                (isLoading || isMetatransactionProcessing)
              }
              disabled={
                !isBiconomyInitialized ||
                (isEdit &&
                  (storageForm.value === "" ||
                    storageForm.signatureType === ""))
              }
              style={{ width: "100%", maxWidth: "280px" }}
            >
              {isEdit ? "Set Storage" : "Edit Storage"}
            </Button>
            {!isBiconomyInitialized && (
              <Typography.Text>Loading dApp...</Typography.Text>
            )}
          </div>
        </div>
      </form>
    </Card>
  );
}
