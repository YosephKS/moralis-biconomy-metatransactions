import { Spin } from "antd";
import Blockies from "react-blockies";
import { useMoralis } from "react-moralis";

/**
 * Shows a blockie image for the provided wallet address
 * @param {*} props
 * @returns <Blockies> JSX Elemenet
 */

function Blockie(props) {
  const { account } = useMoralis();
  return !props.address && !account ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin />
    </div>
  ) : (
    <Blockies
      seed={
        props.currentWallet
          ? account?.toLowerCase()
          : props?.address?.toLowerCase()
      }
      className="identicon"
      {...props}
    />
  );
}

export default Blockie;
