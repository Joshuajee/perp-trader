import { deployPriceAggregator, deployTokens } from "./mockHelper";
import { deploy, depositLiquidity } from "./helpers";
import { parseEther } from "viem";

const amount = parseEther("10000", "wei")

const sizeAmount = parseEther("100", "wei")

const collateralAmount = parseEther("10", "wei")

async function main() {

    const {gho, btc, eth, link, forth }  = await deployTokens()

    console.log("-------------------------------------------------------------------")

    console.log("Tokens Deployed")

    console.log("GHO:   ", gho.address)

    console.log("BTC:   ", btc.address)

    console.log("ETH:   ", eth.address)

    console.log("LINK:  ", link.address)

    console.log("FORTH: ", forth.address)

    console.log("-------------------------------------------------------------------")

    const priceAggregator = await deployPriceAggregator()

    console.log("Chainlink Price Aggregator Deployed")

    console.log("Tokens Deployed")

    console.log("GHO Price Feeds:   ", priceAggregator.ghoPriceFeeds.address)

    console.log("BTC Price Feeds:   ", priceAggregator.btcPriceFeeds.address)

    console.log("ETH Price Feeds:   ", priceAggregator.ethPriceFeeds.address)

    console.log("LINK Price Feeds:  ", priceAggregator.linkPriceFeeds.address)

    console.log("FORTH Price Feeds: ", priceAggregator.forthPriceFeeds.address)

    console.log("-------------------------------------------------------------------")

    const { perpTrader } = await deploy(gho.address, priceAggregator.ghoPriceFeeds.address)

    await perpTrader.write.addPriceFeed([btc.address, priceAggregator.btcPriceFeeds.address])

    await perpTrader.write.addPriceFeed([eth.address, priceAggregator.ethPriceFeeds.address])

    console.log("PerpTrader Deployed")

    console.log("PerpTrader: ", perpTrader.address)

    console.log("-------------------------------------------------------------------")

    await depositLiquidity(gho.address, perpTrader.address, amount)

    await perpTrader.write.addPair([
      {
        baseCurrency: btc.address, 
        quoteCurrency: eth.address
      }]
    )

    await perpTrader.write.addPair([
        {
          baseCurrency: btc.address, 
          quoteCurrency: link.address
        }]
    )

    await perpTrader.write.addPair([
        {
          baseCurrency: eth.address, 
          quoteCurrency: link.address
        }]
    )

    await perpTrader.write.addPair([
        {
          baseCurrency: btc.address, 
          quoteCurrency: forth.address
        }]
    )

    await perpTrader.write.addPair([
        {
          baseCurrency: eth.address, 
          quoteCurrency: forth.address
        }]
    )

    await perpTrader.write.addPair([
        {
          baseCurrency: link.address, 
          quoteCurrency: forth.address
        }]
    )

    await perpTrader.write.addPair([
        {
          baseCurrency: btc.address, 
          quoteCurrency: gho.address
        }]
    )

    await perpTrader.write.addPair([
        {
          baseCurrency: eth.address, 
          quoteCurrency: gho.address
        }]
    )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
