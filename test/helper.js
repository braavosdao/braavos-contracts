const { ethers } = require("hardhat");

function toBravoAmount(value) {
  return ethers.utils.parseUnits(String(value), 9);
}

module.exports = {
  toBravoAmount,
};
