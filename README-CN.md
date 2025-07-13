[English](./README.md)

# RWA 代币化及利息分发 DApp

本项目是一个全栈解决方案，用于演示如何将现实世界资产（RWA）——此处以“沪深300指数代币”为例——进行代币化，并通过一个去中心化应用（DApp）向代币持有者分发利息。

项目包含两个核心部分：
1.  **`contracts`**: 一个 Hardhat 项目，包含了构成系统基础的 Solidity 智能合约。
2.  **`dapp`**: 一个 Vue.js 前端应用，为用户提供了与智能合约交互的友好界面。

---

## 1. `contracts` - 智能合约系统

这部分项目处理所有链上逻辑。

#### 核心合约

-   **`CSI300Token.sol`**: 代表沪深300指数的 ERC20 代币。它包含了快照、黑名单和冻结余额等功能。
-   **`InterestDistribution.sol`**: 核心业务合约，负责根据用户在某个余额快照时的 `CSI300Token` 持有量，向他们分发 `MockUSDT` 利息。
-   **`MockUSDT.sol`**: 一个模拟的 ERC20 代币，用作利息进行分发。
-   **`MockOracle.sol`**: 一个模拟的预言机，用于提供价格数据。

#### 功能特性

-   **基于快照的利息**: 利息根据用户在特定时间点（“快照”）的代币持有量计算，确保公平分配。
-   **管理员控制周期**: 合约所有者通过设置总利息额来启动每个利息分发周期。
-   **安全功能**: 包括将地址列入黑名单，禁止其转移代币或领取利息。

关于部署和测试合约的详细指南，请参阅 **[contracts/README.md](./contracts/README.md)**。

## 2. `dapp` - 前端应用

这是一个使用 Vue 3 和 Vite 构建的 DApp，用于与已部署的合约进行交互。

#### 功能特性

-   **钱包连接**: 可与 MetaMask 等浏览器钱包插件连接。
-   **利息领取**: 为用户提供一个简单的界面来领取他们应得的利息。
-   **管理面板**: 为合约所有者提供一个专用的 UI，用于启动新的利息分发周期。
-   **实时反馈**: 显示交易的实时状态。

关于设置 DApp 的详细指南，请参阅 **[dapp/README.md](./dapp/README.md)**。

## 如何运行完整项目

#### 前置要求

-   [Node.js](https://nodejs.org/) (推荐 v18+)
-   [npm](https://www.npmjs.com/)
-   装有钱包插件（如 [MetaMask](https://metamask.io/)）的现代浏览器。

#### 第一步：部署智能合约

1.  进入 `contracts` 目录：
    ```bash
    cd contracts
    ```
2.  安装依赖：
    ```bash
    npm install
    ```
3.  启动本地 Hardhat 节点：
    ```bash
    npx hardhat node
    ```
4.  在**一个新的终端**中，将合约部署到本地节点：
    ```bash
    npx hardhat run scripts/deploy-interest.ts --network localhost
    ```
5.  记下终端输出中部署好的 `interestDistribution` 合约地址。

#### 第二步：配置并运行 DApp

1.  进入 `dapp` 目录：
    ```bash
    cd ../dapp 
    ```
2.  安装依赖：
    ```bash
    npm install
    ```
3.  配置合约地址：
    -   打开 `src/contract-config.js` 文件。
    -   将 `interestDistributionAddress` 的值更新为您在上一步中记下的合约地址。
4.  运行 DApp 开发服务器：
    ```bash
    npm run dev
    ```
5.  在浏览器中打开命令行提供的本地 URL (例如 `http://localhost:5173`)，即可与应用交互。
