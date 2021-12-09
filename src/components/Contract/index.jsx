import {
  Card,
  Form,
  Typography,
  Skeleton /*notification*/,
  Button,
} from "antd";
import { useEffect, useMemo } from "react";
import simpleStorageContract from "contracts/SimpleStorage.json";
import Address from "components/Address/Address";
import { useMoralis, useChain, useWeb3Contract } from "react-moralis";
import simpleStorage from "list/simpleStorage.json";

export default function Contract() {
  const { isInitialized, isWeb3Enabled } = useMoralis();
  const { chainId } = useChain();
  const { contractName, abi } = simpleStorageContract;

  const contractAddress = useMemo(() => simpleStorage[chainId], [chainId]);

  const { runContractFunction, data, isFetching, isLoading } =
    useWeb3Contract();

  const isLoadingOrFetching = useMemo(
    () => isLoading || isFetching,
    [isLoading, isFetching]
  );

  useEffect(() => {
    if (isInitialized && isWeb3Enabled) {
      runContractFunction({
        params: {
          functionName: "getStorage",
          abi,
          contractAddress,
          params: {},
        },
      });
    }
  }, [isInitialized, isWeb3Enabled, runContractFunction, contractAddress, abi]);

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
      <Form.Provider onFormFinish={async (name, { forms }) => {}}>
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
          {isLoadingOrFetching ? (
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
                {data}
              </Typography.Text>
            </div>
          )}
          <Button
            type="primary"
            shape="round"
            size="large"
            htmlType="submit"
            style={{ width: "100%", maxWidth: "280px" }}
          >
            Set Storage
          </Button>
        </div>
      </Form.Provider>
    </Card>
  );
}
