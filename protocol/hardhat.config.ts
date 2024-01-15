import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import 'hardhat-abi-exporter';
import 'hardhat-contract-sizer';
import dotenv from 'dotenv';

dotenv.config()


const config: HardhatUserConfig = {
  solidity: "0.8.20",
  abiExporter: [
		{
			path: '../client/src/abi',
			pretty: false,
			runOnCompile: true,
      		only: ["PerpTrades", "CollateralBank", "MockERC20.sol"]
		}
	],
	contractSizer: {
		alphaSort: true,
		disambiguatePaths: false,
		runOnCompile: true,
		strict: true,
		only: [ "PerpTrades", "CollateralBank"]
	},
	// networks: {
	// 	mumbai: {
	// 		url: 'https://polygon-mumbai.g.alchemy.com/v2/1yHVzG9cEm8g0IJKQA0VO-nczdGW4NgO',
	// 		accounts: [ PRIVATE_KEY ]
	// 	},
	// 	fuji: {
	// 		url: 'https://aged-wider-needle.avalanche-testnet.quiknode.pro/d0313dfde220dd7912c814a6fa97a0620e95d924/ext/bc/C/rpc/',
	// 		accounts: [ PRIVATE_KEY ]
	// 	},
	// },
};

export default config;
