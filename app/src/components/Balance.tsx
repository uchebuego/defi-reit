import { useContext, useEffect, useState } from "react";
import { WalletConnectContext } from "../context/walletconnect.context.tsx";
import axios from "axios";

export default function Balance() {
  const [balance, setBalance] = useState(0);
  const [hasNFT, setHasNFT] = useState(null);
  const { connected, accounts } = useContext(WalletConnectContext);

  const tokenId = "479319";

  useEffect(() => {
    if (!connected) return;

    axios
      .get("http://localhost:3000/get-token-balance", {
        params: {
          walletAddress: accounts[0],
          contractAddress: "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee",
        },
      })
      .then((res) => {
        setBalance(res.data.balance);
      })
      .catch(() => {
        alert("Could not fetch balance using API");
      });

    axios
      .get("http://localhost:3000/check-ownership", {
        params: {
          walletAddress: accounts[0],
          tokenId,
        },
      })
      .then((res) => {
        setHasNFT(res.data.owned);
      })
      .catch(() => {
        alert("Could not confirm NFT ownership");
      });
  }, [connected]);

  return (
    accounts && (
      <div>
        <div className="p-3 mb-4 rounded-xl bg-slate-200">
          Balance: {balance}
        </div>
        <div className="p-3 bg-pink-100 rounded-xl">
          Account{" "}
          <span className="max-w-[100px] inline-block whitespace-nowrap align-middle text-ellipsis overflow-hidden">
            {accounts[0]}
          </span>{" "}
          {hasNFT ? `owns` : "does not own"} {tokenId}
        </div>
      </div>
    )
  );
}
