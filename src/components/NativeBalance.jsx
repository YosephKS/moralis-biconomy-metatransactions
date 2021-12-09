import { useChain, useMoralis, useNativeBalance } from "react-moralis";
import { getNativeByChain } from "helpers/networks";

function NativeBalance(props) {
  const { Moralis } = useMoralis();
  const { chainId } = useChain();
  const { data } = useNativeBalance(props);
  const { balance } = data ?? {};

  return (
    <div style={{ textAlign: "center", whiteSpace: "nowrap" }}>
      {Moralis.Units.FromWei(balance).toFixed(2)} {getNativeByChain(chainId)}
    </div>
  );
}

export default NativeBalance;
