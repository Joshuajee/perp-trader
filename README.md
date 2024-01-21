# PERP-GHO

PERP-GHO creates a new use case for GHO tokens as it only accepts liquidity and collateral in GHO tokens, the protocol is primarily made up of two types of users.

- The Liquidity Providers
- The Traders

**The Liquidity Providers** deposit GHO tokens into the protocol, these tokens are held in a Smart vault (ERC4646) profit and losses are shared equally among the Liquidity Providers. Liquidity Providers facilitate trades within the protocol by taking the opposite sides of every position opened by the trader, so they earn when traders lose and lose when traders win, and they also earn interest on every position opened by the trader.

**The Traders** deposit GHO tokens as Collateral, needed for opening Long or Short positions, their collateral needs to be large enough for the positions they are opening, Traders can open many positions with a single collateral as long as it is below the maximum Leverage.

This is where the concept of Leverage comes in. For example;
Leverage  = 500

A Trader can open a maximum position size worth about 5000GHO, if they provide a collateral of about 10 GHO.

Leverage = Total Position Size / (Collateral + TotalPnL)

TotalPnL = Total Profit and Loss of all positions opened by trader minus interest.

**Liquidation**
If a Trader goes above the Leverage (500), they become due for Liquidation, this means that anyone can call the Liquidation function on the user and close their positions until their leverage falls below 500. The Person who calls this liquidation function gets a fee.


## How to use
- Enter to the `protocol` folder and run `yarn install` to install all dependencies.

- Run `yarn hardhat node` to start the local blockchain.

- Copy the first address private key and add it to your metamask. 
  
- Run `yarn deploy-local` to deploy the contract on localhost.

- Enter to the `client` folder and run `npm install` to install all dependencies.

- Copy the config in the `env.example`, create `.env` file and place them there.

- Create an account with [infura.io](https://infura.io) and add your infuria id to the `.env` file
  VITE_INFURA_ID="infuria-id"

- Create an account with [wallet-connect](https://walletconnect.com) and add your project id to the `.env` file VITE_WALLETCONNECT_PROJECT_ID="wallet-connect-project-id"

- Run `npm run dev` to start the dev server, make sure your metalmask is connected to localhost, enjoy.

