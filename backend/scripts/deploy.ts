import { ethers } from "hardhat";

async function main() {
  const whitelistContract = await ethers.getContractFactory("Whitelist");

  const deployWhitelistContract = await whitelistContract.deploy(10);

  await deployWhitelistContract.deployed();

  console.log(deployWhitelistContract.address);
}

main()
  .then(() => (process.exitCode = 0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
