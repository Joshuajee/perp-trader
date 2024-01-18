import { deployPriceAggregator, deployTokens } from "./mockHelper";
import { deploy, depositLiquidity, tokenSymbols } from "./helpers";
import { parseEther } from "viem";
import { viem } from "hardhat";

const amount = parseEther("100", "wei")


async function main() {

  const gho = "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60"

  const { ghoToken, btc, eth, link, forth }  = tokenSymbols()

  console.log("-------------------------------------------------------------------")

  console.log("Tokens Deployed")

  console.log("GHO:   ", gho)

  const ghoPriceFeeds = "0x635A86F9fdD16Ff09A0701C305D3a845F1758b8E"

  const btcPriceFeeds = "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43"

  const ethPriceFeeds = "0x694AA1769357215DE4FAC081bf1f309aDC325306"

  const linkPriceFeeds = "0xc59E3633BAAC79493d908e63626716e204A45EdF"

  const forthPriceFeeds = "0x070bF128E88A4520b3EfA65AB1e4Eb6F0F9E6632"

  console.log("-------------------------------------------------------------------")

  console.log("GHO Price Feeds:   ", ghoPriceFeeds)

  console.log("BTC Price Feeds:   ", btcPriceFeeds)

  console.log("ETH Price Feeds:   ", ethPriceFeeds)

  console.log("LINK Price Feeds:  ", linkPriceFeeds)

  console.log("FORTH Price Feeds: ", forthPriceFeeds)

  console.log("-------------------------------------------------------------------")

  const perpTrader = await viem.deployContract("PerpTrades", [gho, ghoPriceFeeds, "aGho", "aGho"])

  console.log("Perp Trader ", perpTrader.address)
  
  //const { perpTrader } = await deploy(gho, ghoPriceFeeds)

  await perpTrader.write.addPriceFeed([btc, btcPriceFeeds])

  await perpTrader.write.addPriceFeed([eth, ethPriceFeeds])

  await perpTrader.write.addPriceFeed([link, linkPriceFeeds])

  await perpTrader.write.addPriceFeed([forth, forthPriceFeeds])

  console.log("PerpTrader Deployed")

  console.log("PerpTrader: ", perpTrader.address)

  console.log("-------------------------------------------------------------------")

  await depositLiquidity(gho, perpTrader.address, amount)

  await perpTrader.write.addPair([
    {
      baseCurrency: btc, 
      quoteCurrency: eth
    }]
  )

  await perpTrader.write.addPair([
    {
      baseCurrency: btc, 
      quoteCurrency: link
    }]
  )

  await perpTrader.write.addPair([
    {
      baseCurrency: eth, 
      quoteCurrency: link
    }]
  )

  await perpTrader.write.addPair([
    {
      baseCurrency: btc, 
      quoteCurrency: forth
    }]
  )

  await perpTrader.write.addPair([
    {
      baseCurrency: eth, 
      quoteCurrency: forth
    }]
  )

  await perpTrader.write.addPair([
    {
      baseCurrency: link, 
      quoteCurrency: forth
    }]
  )

  await perpTrader.write.addPair([
    {
      baseCurrency: btc, 
      quoteCurrency: ghoToken
    }]
  )

  await perpTrader.write.addPair([
    {
      baseCurrency: eth, 
      quoteCurrency: ghoToken
    }]
  )

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
