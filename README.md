# `moralis-biconomy-metatransactions`

This Project is a fork of [Ethereum Boilerplate](https://github.com/ethereum-boilerplate/ethereum-boilerplate) and demostrates how you can enable gasless transaction/metatransactions using Moralis and Biconomy. This project of course work on any EVM-compatible blockchain such as Polygon, Avalanche, Binance Smart Chain and other such chains.

![dapp3](https://github.com/YosephKS/moralis-biconomy-metatransactions/blob/main/preview.gif)

# ⭐️ `Star us`
If this boilerplate helps you build Ethereum dapps faster - please star this project, every star makes us very happy!

# 🤝 How to get help
If you have any questions or need help running this project please don't hesitate to ask in our [forum](https://forum.moralis.io/t/moralis-gasless-transaction-tutorial/5963). We are monitoring it 24/7 and are here to help you get up to speed.

# 🚀 Quick Start

📄 Clone or fork `moralis-biconomy-metatransactions`:
```sh
git clone https://github.com/YosephKS/moralis-biconomy-metatransactions.git
```
💿 Install all dependencies:
```sh
cd moralis-biconomy-metatransactions
yarn install 
```
✏ Rename `.env.example` to `.env` in the main folder and provide your `appId` and `serverUrl` from Moralis ([How to start Moralis Server](https://docs.moralis.io/moralis-server/getting-started/create-a-moralis-server)), plus some other Biconomy API Keys:
```jsx
REACT_APP_MORALIS_APPLICATION_ID=xxx
REACT_APP_MORALIS_SERVER_URL=xxx
REACT_APP_MORALIS_SPEEDY_NODES_KEY=xxx
REACT_APP_BICONOMY_API_KEY_KOVAN=xxx
REACT_APP_BICONOMY_API_KEY_BSC_TESTNET=xxx
REACT_APP_BICONOMY_API_KEY_MUMBAI=xxx
REACT_APP_BICONOMY_API_KEY_FUJI=xxx
```
🚴‍♂️ Run your App:
```sh
yarn start
```



