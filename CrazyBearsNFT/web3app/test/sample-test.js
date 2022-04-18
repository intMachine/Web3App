// npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers @openzeppelin/contracts

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrazyBearzz", function () {
  it("Should return the new greeting once it's changed", async function () {
    const CrazyBearzz = await ethers.getContractFactory("CrazyBearzz");
    const crazyBearzz = await CrazyBearzz.deploy();
    await crazyBearzz.deployed();

    const recipient = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
    const metadataURI = "cid/test.png";

    let balance = await crazyBearzz.balanceOf(recipient);
    expect(balance).to.equal(0);
    newlyMintedToken = await crazyBearzz.payToMint(recipient, metadataURI, {
      value: ethers.utils.parseEther("0.1"),
    });

    await newlyMintedToken.wait();
    balance = await crazyBearzz.balanceOf(recipient);
    expect(balance).to.equal(1);
    expect(await crazyBearzz.isContentOwned(metadataURI)).to.equal(true);
  });
});
