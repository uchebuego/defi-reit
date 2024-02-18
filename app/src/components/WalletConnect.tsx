import { useContext } from "react";
import { WalletConnectContext } from "../context/walletconnect.context.tsx";

export function WalletConnect() {
  const { accounts, connected, connectWallet } =
    useContext(WalletConnectContext);

  return (
    <div>
      {connected ? (
        <div>
          <h1 className="text-sm whitespace-nowrap text-ellipsis overflow-hidden bg-purple-600 p-3 rounded-lg font-medium w-full text-white">
            Connected to {accounts && accounts[0]}
          </h1>
        </div>
      ) : (
        <button
          className="bg-purple-500 p-3 rounded-lg text-sm font-medium w-full text-white"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
