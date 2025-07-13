[中文](./README-CN.md)

# RWA Tokenization and Interest Distribution DApp

This project demonstrates a full-stack solution for tokenizing a Real-World Asset (RWA), in this case, a CSI 300 Index Token, and distributing interest to token holders through a decentralized application (DApp).

The project is divided into two main parts:
1.  **`contracts`**: A Hardhat project containing the Solidity smart contracts that form the backbone of the system.
2.  **`dapp`**: A Vue.js frontend application that provides a user-friendly interface for interacting with the smart contracts.

---

## 1. `contracts` - The Smart Contract System

This part of the project handles the on-chain logic.

#### Key Contracts

-   **`CSI300Token.sol`**: An ERC20 token representing the CSI 300 Index. It includes features like snapshotting, blacklisting, and freezing balances.
-   **`InterestDistribution.sol`**: The core contract that manages the distribution of interest (in `MockUSDT`) to `CSI300Token` holders based on a snapshot of their balances.
-   **`MockUSDT.sol`**: A mock ERC20 token used for distributing interest.
-   **`MockOracle.sol`**: A mock oracle for providing price data.

#### Features

-   **Snapshot-based Interest**: Interest is calculated based on token holdings at a specific point in time (a "snapshot"), ensuring fair distribution.
-   **Admin-controlled Periods**: The contract owner initiates each interest distribution period by setting the total interest amount.
-   **Security Features**: Includes blacklisting addresses from transferring tokens or claiming interest.

For detailed instructions on deploying and testing the contracts, please refer to **[contracts/README.md](./contracts/README.md)**.

## 2. `dapp` - The Frontend Application

This is a Vue 3 and Vite-powered DApp for interacting with the deployed contracts.

#### Features

-   **Wallet Connection**: Connects with browser wallets like MetaMask.
-   **Interest Claiming**: A simple interface for users to claim their earned interest.
-   **Admin Panel**: A dedicated UI for the contract owner to start new interest distribution periods.
-   **Reactive Feedback**: Shows real-time transaction status.

For detailed instructions on setting up the DApp, please refer to **[dapp/README.md](./dapp/README.md)**.

## How to Run the Full Project

#### Prerequisites

-   [Node.js](https://nodejs.org/) (v18+)
-   [npm](https://www.npmjs.com/)
-   A browser with a wallet extension like [MetaMask](https://metamask.io/).

#### Step 1: Deploy the Contracts

1.  Navigate to the `contracts` directory:
    ```bash
    cd contracts
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start a local Hardhat node:
    ```bash
    npx hardhat node
    ```
4.  In a **new terminal**, deploy the contracts to the local node:
    ```bash
    npx hardhat run scripts/deploy-interest.ts --network localhost
    ```
5.  Note the deployed `interestDistribution` contract address from the terminal output.

#### Step 2: Configure and Run the DApp

1.  Navigate to the `dapp` directory:
    ```bash
    cd ../dapp 
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure the contract address:
    -   Open `src/contract-config.js`.
    -   Update the `interestDistributionAddress` with the address you noted from the deployment step.
4.  Run the DApp development server:
    ```bash
    npm run dev
    ```
5.  Open your browser to the provided local URL (e.g., `http://localhost:5173`) and interact with the application.
