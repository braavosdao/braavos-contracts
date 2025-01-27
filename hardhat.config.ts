import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import '@openzeppelin/hardhat-upgrades';
import '@atixlabs/hardhat-time-n-mine';
import { ethers } from 'ethers';

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
      },
      {
        version: "0.7.5",
      },
    ],
  },
  networks: {
    // ropsten: {
    //   url: process.env.ROPSTEN_URL || "",
    //   accounts:
    //     process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    // },
    // matic: {
    //   url: process.env.MATIC_URL || "",
    //   // gasPrice: 100e9,
    //   // timeout: 200000,
    //   accounts:
    //     process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    // },
    mumbai: {
      url: process.env.POLYGON_MUMBAI_RPC || "",
      // gasPrice: 5e9,
      accounts: process.env.MUMBAI_DEPLOYER_PRIVATE_KEY !== undefined ? [process.env.MUMBAI_DEPLOYER_PRIVATE_KEY] : [],
      gas: 'auto',
      gasPrice: ethers.utils.parseUnits('1.2', 'gwei').toNumber(),
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
