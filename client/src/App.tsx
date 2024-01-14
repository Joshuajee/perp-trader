import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "@pages/Layout";
import Home from "@pages/Home";
import NoPage from "@pages/NoPage";
import Vault from "@pages/Vault";

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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/vault" element={<Vault />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default App