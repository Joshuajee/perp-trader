import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, ConnectKitButton, getDefaultConfig } from "connectkit";

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    infuraId: import.meta.env.INFURA_ID, // or infuraId
    walletConnectProjectId: `${import.meta.env.WALLETCONNECT_PROJECT_ID}`,

    // Required
    appName: "Your App Name",

    // Optional
    appDescription: "A perpetuals trading platform",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

const App = () => {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        /* Your App */
        <ConnectKitButton />
        <div className="bg-red-400"></div>
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default App