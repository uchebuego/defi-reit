import {
  createContext,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import Web3 from "web3";
import { EthereumProvider } from "@walletconnect/ethereum-provider";

export const WalletConnectContext = createContext<any>({});

export function WalletConnectProvider({ children }: PropsWithChildren) {
  // const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState<string[]>();
  const [connected, setConnected] = useState(false);
  const providerRef = useRef<any>();

  useEffect(() => {
    const initWeb3 = async () => {
      providerRef.current = await EthereumProvider.init({
        projectId: "1169d6f3ea08cdf1feaa21d99583541d",
        chains: [97],
        showQrModal: true,
      });
    };

    initWeb3();
  }, []);

  const connectWallet = async function () {
    const provider = providerRef.current;

    await provider.enable();

    const web3 = new Web3(provider);

    const accounts = await web3.eth.getAccounts();

    // setWeb3(web3);
    setAccounts(accounts);
    setConnected(true);
  };

  return (
    <WalletConnectContext.Provider
      value={{ accounts, connected, connectWallet }}
    >
      {children}
    </WalletConnectContext.Provider>
  );
}
