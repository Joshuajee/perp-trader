import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "hardhat-abi-exporter";
import "hardhat-contract-sizer";
import dotenv from "dotenv";

dotenv.config();

// const PRIVATE_KEY  = String(process.env.PRIVATE_KEY)

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.10",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },

  abiExporter: [
    {
      path: "../client/src/abi",
      pretty: false,
      runOnCompile: true,
      only: ["PerpTrades", "CollateralBank", "MockERC20.sol"],
    },
  ],
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    only: ["PerpTrades", "CollateralBank"],
  },

  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337, // Customize the chain ID here
    },
    sepolia: {
      url: "https://sepolia.drpc.org",
      // accounts: [ PRIVATE_KEY ]
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/1yHVzG9cEm8g0IJKQA0VO-nczdGW4NgO",
      // accounts: [ PRIVATE_KEY ]
    },
  },
};

export default config;
