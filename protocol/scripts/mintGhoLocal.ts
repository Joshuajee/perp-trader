import { viem } from "hardhat";
import { parseEther } from "viem";


async function main() {

    const amount = parseEther("100000", "wei")

    const ghoAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

    const gho = await viem.getContractAt("MockERC20", ghoAddress)

    await gho.write.mint(["0x70997970C51812dc3A010C7d01b50e0d17dc79C8", amount])

    await gho.write.mint(["0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", amount])

    await gho.write.mint(["0x90F79bf6EB2c4f870365E785982E1f101E93b906", amount])

    await gho.write.mint(["0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", amount])
  

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
