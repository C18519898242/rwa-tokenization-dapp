# Interest Distribution DApp

This project is a decentralized application (DApp) that provides a user interface for interacting with the `InterestDistribution` smart contract system. It allows users to connect their Web3 wallet, and claim their token interest. It also provides an admin panel for the contract owner to manage the interest distribution periods.

This DApp is built with Vue 3 and Vite, and uses ethers.js to communicate with the Ethereum blockchain.

## Features

-   **Web3 Wallet Connection**: Connects to browser wallet extensions like MetaMask.
-   **Network Agnostic**: Currently configured for the Sepolia testnet, but can be pointed to any EVM-compatible network.
-   **Interest Claiming**: Allows users to call the `claimInterest` function on the smart contract.
-   **Admin Panel**: A special UI for the contract owner to call the `setTotalInterest` function, which is required to start a new interest distribution period.
-   **Reactive Status Updates**: Provides real-time feedback on transaction status.

## Prerequisites

-   [Node.js](https://nodejs.org/) (v18+ recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js)
-   A modern web browser (Chrome, Firefox, Brave, etc.)
-   A browser wallet extension, such as [MetaMask](https://metamask.io/).

## Project Setup and Running

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone https://github.com/C18519898242/rwa-dapp.git
    cd rwa-dapp
    ```

2.  **Install dependencies**:
    Navigate to the `dapp` directory and install the required npm packages.
    ```bash
    npm install
    ```

3.  **Configure the Smart Contract**:
    This DApp needs to know the address of the deployed `InterestDistribution` contract and the network it's on.
    -   Update the `interestDistributionAddress` in `src/contract-config.js`.
    -   Update the `sepoliaNetwork` details in `src/App.vue` if you are using a different network.

4.  **Run the Development Server**:
    This command starts a local development server, usually on `http://localhost:5173`.
    ```bash
    npm run dev
    ```

## How to Use the DApp

1.  **Open the DApp**:
    Navigate to the URL provided by the `npm run dev` command (e.g., `http://localhost:5173`).

2.  **Configure MetaMask**:
    -   Make sure your MetaMask wallet is unlocked.
    -   Switch MetaMask to the network the smart contract is deployed on (e.g., **Sepolia Testnet**).
    -   Ensure your account has enough native currency (e.g., Sepolia ETH) to pay for gas fees.

3.  **Connect Wallet**:
    Click the "Connect Wallet" button on the DApp interface.

4.  **(Admin Only) Set Interest**:
    If you are connected with the wallet address that owns the contract, an "Admin Panel" will appear.
    -   Enter the total amount of USDT to be distributed for the period.
    -   Click "Set Total Interest".
    -   Confirm the transaction in MetaMask.
    This step must be completed before any user can claim interest.

5.  **Claim Interest**:
    Once the interest has been set by the admin, any user can click the "Claim Interest" button to receive their share.
    -   Click "Claim Interest".
    -   Confirm the transaction in MetaMask.

## Technology Stack

-   **Frontend**: [Vue 3](https://vuejs.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Blockchain Interaction**: [ethers.js](https://ethers.io/)
-   **Smart Contracts**: Solidity, Hardhat (in the corresponding `contract` repository)
