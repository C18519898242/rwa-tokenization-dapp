<script setup>
import { ref } from 'vue';
import { ethers } from 'ethers';
import { interestDistributionAddress, interestDistributionAbi } from './contract-config';

const account = ref(null);
const contract = ref(null);
const status = ref('Please connect your wallet.');
const owner = ref(null);
const isOwner = ref(false);
const totalInterestInput = ref('1000'); // Default to 1000 USDT

// Sepolia network details
const sepoliaNetwork = {
  chainId: '11155111',
  chainName: 'Sepolia Testnet'
};

async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    status.value = 'Error: MetaMask is not installed. Please install it to use this DApp.';
    return;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Check if connected to the correct network
    const network = await provider.getNetwork();
    if (network.chainId.toString() !== sepoliaNetwork.chainId) {
      status.value = `Error: Please switch MetaMask to the ${sepoliaNetwork.chainName} (Chain ID: ${sepoliaNetwork.chainId}) and try again.`;
      return;
    }

    // Request account access
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    account.value = signerAddress;

    // Create contract instance
    const interestContract = new ethers.Contract(interestDistributionAddress, interestDistributionAbi, signer);
    contract.value = interestContract;

    // Check if the connected account is the owner
    const contractOwner = await interestContract.owner();
    owner.value = contractOwner;
    if (signerAddress.toLowerCase() === contractOwner.toLowerCase()) {
      isOwner.value = true;
    }

    status.value = `Connected: ${signerAddress}`;
  } catch (error) {
    console.error('Error connecting wallet:', error);
    status.value = 'Failed to connect wallet. Ensure it is unlocked and on the correct network.';
  }
}

async function claimInterest() {
  if (!contract.value) {
    status.value = 'Contract not initialized.';
    return;
  }

  try {
    status.value = 'Encoding transaction data for claimInterest...';
    const contractInterface = new ethers.Interface(interestDistributionAbi);
    const encodedData = contractInterface.encodeFunctionData("claimInterest");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const tx = {
      to: interestDistributionAddress,
      from: await signer.getAddress(),
      data: encodedData,
    };

    status.value = 'Sending transaction... Please confirm in MetaMask.';
    const txResponse = await signer.sendTransaction(tx);
    status.value = `Transaction sent! Hash: ${txResponse.hash}. Waiting for confirmation...`;
    await txResponse.wait();
    status.value = 'Success! Interest has been claimed.';
  } catch (error) {
    console.error('Error claiming interest:', error);
    status.value = `Error claiming interest: ${error.reason || error.message}`;
  }
}

async function setTotalInterest() {
  if (!contract.value || !isOwner.value) {
    status.value = 'Only the owner can perform this action.';
    return;
  }
  try {
    status.value = 'Encoding transaction data for setTotalInterest...';
    const contractInterface = new ethers.Interface(interestDistributionAbi);
    const amount = ethers.parseUnits(totalInterestInput.value, 18);
    const encodedData = contractInterface.encodeFunctionData("setTotalInterest", [amount]);

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const tx = {
      to: interestDistributionAddress,
      from: await signer.getAddress(),
      data: encodedData,
    };

    status.value = 'Sending transaction... Please confirm in MetaMask.';
    const txResponse = await signer.sendTransaction(tx);
    status.value = `Set interest transaction sent: ${txResponse.hash}. Waiting for confirmation...`;
    await txResponse.wait();
    status.value = 'Total interest has been set successfully! Users can now claim.';
  } catch (error) {
    console.error('Error setting total interest:', error);
    status.value = `Error: ${error.reason || error.message}`;
  }
}
</script>

<template>
  <div id="app">
    <header>
      <h1>Interest Distribution DApp</h1>
    </header>
    <main>
      <div class="card">
        <h2>Instructions</h2>
        <p>1. Make sure MetaMask is installed and unlocked.</p>
        <p>2. Manually switch to the Sepolia test network in MetaMask.</p>
        <p>(Sepolia is usually available by default in MetaMask under test networks).</p>
        <p>3. Click the button below to connect.</p>
      </div>

      <div class="card">
        <h2>Wallet Connection</h2>
        <button @click="connectWallet" v-if="!account">Connect Wallet</button>
        <div v-if="account">
          <p><strong>Account:</strong> {{ account }}</p>
        </div>
      </div>

      <div class="card admin-card" v-if="isOwner">
        <h2>Admin Panel</h2>
        <p>Set the total USDT interest for the next distribution period.</p>
        <div class="input-group">
          <label for="interest-amount">Total Interest (USDT):</label>
          <input id="interest-amount" type="number" v-model="totalInterestInput" />
        </div>
        <button @click="setTotalInterest">Set Total Interest</button>
      </div>

      <div class="card" v-if="account">
        <h2>Claim Your Interest</h2>
        <p>Click the button below to claim your interest for the current period.</p>
        <button @click="claimInterest">Claim Interest</button>
      </div>

      <div class="card status-card">
        <h2>Status</h2>
        <p>{{ status }}</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 20px;
}
.card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: left;
}
.status-card {
  background-color: #eef7ff;
  border-left: 5px solid #42b983;
  text-align: center;
}
.admin-card {
  background-color: #fffbe6;
  border-left: 5px solid #f59e0b;
}
.input-group {
  margin: 15px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.input-group label {
  margin-right: 10px;
}
.input-group input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 150px;
}
button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  display: block;
  margin: 10px auto;
}
button:hover {
  background-color: #36a476;
}
p {
  word-wrap: break-word;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  background: #eee;
  padding: 5px;
  border-radius: 4px;
  margin-bottom: 5px;
}
</style>
