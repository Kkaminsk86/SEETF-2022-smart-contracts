const { ethers } = require("hardhat");

async function storageAt(address, slot) {
  return await ethers.provider.getStorageAt(address, slot);
}

function fromBytes32(bytes32) {
  return ethers.utils.parseBytes32String(bytes32);
}

async function getBalance(address) {
  return ethers.utils.formatEther(await ethers.provider.getBalance(address));
}

module.exports = { storageAt, fromBytes32, getBalance };
