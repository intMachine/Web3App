const hre = require("hardhat");

async function main() {
  const CrazyBearzz = await hre.ethers.getContractFactory("CrazyBearzz");
  const crazyBearzz = await CrazyBearzz.deploy();

  await crazyBearzz.deployed();

  console.log("CrazyBearzz are gonna be deployed to:", crazyBearzz.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
