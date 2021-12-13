/* eslint-disable react-hooks/exhaustive-deps */
import {
  Card,
  Input,
  Typography,
  Skeleton,
  Button,
  Select,
  notification,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import simpleStorageContract from "contracts/SimpleStorage.json";
import Address from "components/Address/Address";
import { useMoralis, useChain } from "react-moralis";
import simpleStorage from "list/simpleStorage.json";
import { useAPIContract } from "hooks/useAPIContract";
import useBiconomyContext from "hooks/useBiconomyContext";
import useMetaTransaction from "hooks/useMetaTransaction";

export default function Contract() {
  const { isInitialized, isWeb3Enabled, account } = useMoralis();
  const { chainId } = useChain();
  const { isBiconomyInitialized, biconomyProvider } = useBiconomyContext();
  const { contractName, abi } = simpleStorageContract;
  const [isEdit, setIsEdit] = useState(false);
  const initialStorageForm = { value: "", signatureType: "" };
  const [storageForm, setStorageForm] = useState(initialStorageForm);
  const contractAddress = useMemo(() => simpleStorage[chainId], [chainId]);

  /**
   * @description For getting storage data from smart contracts (params defined below);
   */
  const { runContractFunction, contractResponse, isLoading } = useAPIContract();

  /**
   * @description For executing meta transaction
   *
   * @param {String} input - New storage data
   * @param {Address} transactionParams.from - address that will sign the metatransaction
   * @param {String} transactionParams.signatureType - either EIP712_SIGN or PERSONAL_SIGN
   */
  const { isMetatransactionProcessing, onSubmitMetaTransaction } =
    useMetaTransaction({
      input: storageForm.value,
      transactionParams: {
        from: account,
        signatureType: biconomyProvider[storageForm.signatureType],
      },
    });

  /**
   * @description Execute `getStorage` call from smart contract
   *
   * @param {Function} onSuccess - success callback function
   * @param {Function} onError - error callback function
   * @param {Function} onComplete -complete callback function
   */
  const onGetStorage = ({ onSuccess, onError, onComplete }) => {
    runContractFunction({
      params: {
        chain: chainId,
        function_name: "getStorage",
        abi,
        address: contractAddress,
      },
      onSuccess,
      onError,
      onComplete,
    });
  };

  /**
   * @description if `isEdit` is true, execute meta transaction,
   * otherwise set `isEdit` to true
   *
   * @param {*} e
   */
  const onSubmit = async (e) => {
    await e.preventDefault();
    if (isEdit) {
      onSubmitMetaTransaction({
        onConfirmation: () => {
          setIsEdit(false);
          setStorageForm(initialStorageForm);
          onGetStorage({
            onSuccess: () => {
              notification.success({
                message: "Metatransaction Successful",
                description: `You metatransaction has been successfully executed!`,
              });
            },
          });
        },
        onError: () => {
          notification.error({
            message: "Metatransaction Fail",
            description:
              "Your metatransaction has failed. Please try again later.",
          });
        },
      });
    } else {
      setIsEdit(true);
    }
  };

  useEffect(() => {
    /**
     * Running when one of the following conditions fulfilled:
     * - Moralis SDK is Initialized
     * - Web3 has been enabled
     * - Connected Chain Changed
     */
    if (isInitialized && isWeb3Enabled) {
      onGetStorage({
        onSuccess: () => {
          // Reinitialize everything
          setIsEdit(false);
          setStorageForm(initialStorageForm);
        },
      });
    }
  }, [isInitialized, isWeb3Enabled, contractAddress, abi, chainId]);

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
      <form onSubmit={onSubmit}>
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
                      disabled={isMetatransactionProcessing}
                      onChange={(val) =>
                        setStorageForm({ ...storageForm, signatureType: val })
                      }
                    >
                      <Select.Option value="EIP712_SIGN">EIP712</Select.Option>
                      <Select.Option value="PERSONAL_SIGN">
                        Personal
                      </Select.Option>
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
