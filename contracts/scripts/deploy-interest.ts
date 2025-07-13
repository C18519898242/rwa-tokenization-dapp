import { ethers, network } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy MockUSDT
  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const usdt = await MockUSDT.deploy();
  console.log("MockUSDT deployed to:", await usdt.getAddress());

  // Deploy MockOracle
  const MockOracle = await ethers.getContractFactory("MockOracle");
  const oracle = await MockOracle.deploy();
  console.log("MockOracle deployed to:", await oracle.getAddress());

  // Deploy CSI300Token
  const CSI300Token = await ethers.getContractFactory("CSI300Token");
  const csi300Token = await CSI300Token.deploy(await oracle.getAddress());
  console.log("CSI300Token deployed to:", await csi300Token.getAddress());

  // Deploy InterestDistribution
  const InterestDistribution = await ethers.getContractFactory("InterestDistribution");
  const interestDistribution = await InterestDistribution.deploy(await csi300Token.getAddress(), await usdt.getAddress());
  console.log("InterestDistribution deployed to:", await interestDistribution.getAddress());

  // Wait for the InterestDistribution contract to be mined and have a few confirmations
  console.log("Waiting for InterestDistribution deployment to be confirmed...");
  const deployReceipt = await interestDistribution.deploymentTransaction()?.wait(5);
  if (!deployReceipt) {
    throw new Error("InterestDistribution deployment transaction failed to get receipt.");
  }
  console.log(`InterestDistribution confirmed in block: ${deployReceipt.blockNumber}`);
  
  const interestDistributionAddress = await interestDistribution.getAddress();
  console.log(`Got InterestDistribution address: ${interestDistributionAddress}`);

  // Transfer ownership of CSI300Token to InterestDistribution contract
  console.log(`Transferring ownership of CSI300Token to ${interestDistributionAddress}...`);
  const tx = await csi300Token.transferOwnership(interestDistributionAddress);
  console.log(`Ownership transfer transaction sent with hash: ${tx.hash}`);
  await tx.wait(); // Wait for the transaction to be mined
  console.log("Ownership transferred successfully.");

  // Mint some USDT to the InterestDistribution contract for distribution
  await usdt.mint(await interestDistribution.getAddress(), ethers.parseEther("10000")); // 10,000 USDT
  console.log("Minted 10,000 USDT to InterestDistribution contract");

  // Save deployment information if on Sepolia
  if (network.name === "sepolia") {
    const deploymentInfo = {
      deployerAccount: deployer.address,
      mockUSDT: await usdt.getAddress(),
      mockOracle: await oracle.getAddress(),
      csi300Token: await csi300Token.getAddress(),
      interestDistribution: await interestDistribution.getAddress(),
    };

    const filePath = path.join(__dirname, "../test/sepolia-deployment.json");
    fs.writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2));
    console.log(`Deployment info saved to ${filePath}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
