import { deployPriceAggregator, deployTokens } from "./mockHelper";
import { deploy, depositLiquidity, tokenSymbols } from "./helpers";
import { parseEther } from "viem";

const amount = parseEther("10000", "wei")

const sizeAmount = parseEther("100", "wei")

const collateralAmount = parseEther("10", "wei")

async function main() {

  const { gho }  = await deployTokens()

  const { ghoToken, btc, eth, xau, eur }  = tokenSymbols()

  console.log("-------------------------------------------------------------------")

  console.log("Tokens Deployed")

  console.log("GHO:   ", gho.address)

  console.log("-------------------------------------------------------------------")

  const priceAggregator = await deployPriceAggregator()

  console.log("Chainxau Price Aggregator Deployed")

  console.log("Tokens Deployed")

  console.log("GHO Price Feeds:   ", priceAggregator.ghoPriceFeeds.address)

  console.log("BTC Price Feeds:   ", priceAggregator.btcPriceFeeds.address)

  console.log("ETH Price Feeds:   ", priceAggregator.ethPriceFeeds.address)

  console.log("XAU Price Feeds:  ", priceAggregator.xauPriceFeeds.address)

  console.log("EUR Price Feeds: ", priceAggregator.eurPriceFeeds.address)

  console.log("-------------------------------------------------------------------")

  const { perpTrader } = await deploy(gho.address, priceAggregator.ghoPriceFeeds.address)

  await perpTrader.write.addPriceFeed([btc, priceAggregator.btcPriceFeeds.address])

  await perpTrader.write.addPriceFeed([eth, priceAggregator.ethPriceFeeds.address])

  console.log("PerpTrader Deployed")

  console.log("PerpTrader: ", perpTrader.address)

  console.log("-------------------------------------------------------------------")

  await depositLiquidity(gho.address, perpTrader.address, amount)

  await perpTrader.write.addPair([
    {
      baseCurrency: btc, 
      quoteCurrency: eth
    }]
  )

  await perpTrader.write.addPair([
    {
      baseCurrency: btc, 
      quoteCurrency: xau
    }]
  )

  await perpTrader.write.addPair([
    {
      baseCurrency: eth, 
      quoteCurrency: xau
    }]
  )

  await perpTrader.write.addPair([
    {
      baseCurrency: btc, 
      quoteCurrency: eur
    }]
  )

  await perpTrader.write.addPair([
    {
      baseCurrency: eth, 
      quoteCurrency: eur
    }]
  )

  await perpTrader.write.addPair([
    {
      baseCurrency: xau, 
      quoteCurrency: eur
    }]
  )


  await perpTrader.write.addPriceFeed([xau, priceAggregator.xauPriceFeeds.address])

  await perpTrader.write.addPriceFeed([eur, priceAggregator.eurPriceFeeds.address])

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
