const { ethers } = require("hardhat");
const { expect } = require("chai");
const { BigNumber } = require("@ethersproject/bignumber");
const { ContractFactory } = require("ethers");
const UniswapV2FactoryJson = require("@uniswap/v2-core/build/UniswapV2Factory.json");
const UniswapV2PairJson = require("@uniswap/v2-core/build/UniswapV2Pair.json");

describe("BondingCalculator", () => {
  let // Used as default deployer for contracts, asks as owner of contracts.
    deployer,
    // Used as the default user for deposits and trade. Intended to be the default regular user.
    depositor,
    BRAVO,
    bravo,
    DAI,
    dai,
    UniswapV2FactoryContract,
    uniFactory,
    pairAddress,
    UniswapV2Pair,
    lp,
    BondingCalcContract,
    bondingCalc;

  beforeEach(async () => {
    [deployer, depositor] = await ethers.getSigners();

    BRAVO = await ethers.getContractFactory("BravoERC20");
    bravo = await BRAVO.connect(deployer).deploy();
    await bravo.setVault(deployer.address);

    DAI = await ethers.getContractFactory("DAI");
    dai = await DAI.connect(deployer).deploy(0);

    UniswapV2FactoryContract = ContractFactory.fromSolidity(
      UniswapV2FactoryJson,
      deployer
    );
    uniFactory = await UniswapV2FactoryContract.connect(deployer).deploy(
      deployer.address
    );

    await uniFactory.connect(deployer).createPair(bravo.address, dai.address);
    pairAddress = await uniFactory.getPair(bravo.address, dai.address);
    UniswapV2Pair = ContractFactory.fromSolidity(UniswapV2PairJson, deployer);
    lp = await UniswapV2Pair.attach(pairAddress);

    BondingCalcContract = await ethers.getContractFactory("BondingCalculator");
    bondingCalc = await BondingCalcContract.connect(deployer).deploy(
      bravo.address
    );
  });

  describe("getKValue", () => {
    it("should return x*y", async () => {
      const bravoAmount = BigNumber.from(100).mul(BigNumber.from(10).pow(9));
      const daiAmount = BigNumber.from(400).mul(BigNumber.from(10).pow(18));
      await bravo.mint(deployer.address, bravoAmount);
      await dai.mint(deployer.address, daiAmount);

      await bravo.transfer(lp.address, bravoAmount);
      await dai.transfer(lp.address, daiAmount);
      await lp.mint(deployer.address);

      const k = await bondingCalc.getKValue(lp.address);

      expect(k).to.eq(
        BigNumber.from(100).mul(400).mul(BigNumber.from(10).pow(18))
      );
    });
  });

  describe("getTotalValue", () => {
    it("should return total value in USD", async () => {
      const bravoAmount = BigNumber.from(100).mul(BigNumber.from(10).pow(9));
      const daiAmount = BigNumber.from(400).mul(BigNumber.from(10).pow(18));
      await bravo.mint(deployer.address, bravoAmount);
      await dai.mint(deployer.address, daiAmount);

      await bravo.transfer(lp.address, bravoAmount);
      await dai.transfer(lp.address, daiAmount);
      await lp.mint(deployer.address);

      const totalValue = await bondingCalc.getTotalValue(lp.address);

      expect(totalValue).to.eq(400000000000);
    });
  });
});
