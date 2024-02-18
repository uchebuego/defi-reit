import "./App.css";
import { WalletConnect } from "./components/WalletConnect.tsx";
import { WalletConnectProvider } from "./context/walletconnect.context.tsx";
import Balance from "./components/Balance.tsx";

function App() {
  return (
    <WalletConnectProvider>
      <div className="h-screen w-screen grid place-content-center">
        <div className="w-[320px] min-h-[400px] p-6 rounded-xl shadow-lg">
          <div className="mb-4">
            <WalletConnect />
          </div>
          <div>
            <Balance />
          </div>
        </div>
      </div>
    </WalletConnectProvider>
  );
}

export default App;
