const { ethers } = require("hardhat");
const { expect } = require("chai");
const { getBalance } = require("./utils/helpers.js");

async function deployContract(deployer) {
  const Challenge = await ethers.getContractFactory(
    "YouOnlyHaveOneChance",
    deployer
  );
  const challenge = await Challenge.deploy();
  return [challenge];
}

async function main() {
  console.log("CHALLENGE 3 - YouOnlyHaveOneChance \n");

  let [deployer, challenger] = await ethers.getSigners();
  let [challenge] = await deployContract(deployer);

  // Checking if challenge is solved by calling 'isSolved' function from YouOnlyHaveOneChance
  expect(await challenge.isSolved()).to.be.false;

  console.log(
    "Initial status of the challenge. Is challenge solved?:",
    await challenge.isSolved(),
    "\n"
  );

  const Exploit = await ethers.getContractFactory(
    "YouOnlyHaveOneExploit",
    challenger
  );
  await Exploit.deploy(challenge.address);

  expect(await challenge.isSolved()).to.be.true;

  console.log(
    "Final status of the challenge. Is challenge solved?:",
    await challenge.isSolved(),
    "\n"
  );
}

main();
