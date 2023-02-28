require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: process.env.ALCHEMY_ENDPOINT,
      accounts: [process.env.OWNER_PRIVATE_KEY],
    },
    fantom: {
      url: process.env.CHAINSTACK_ENDPOINT,
      accounts: [
        process.env.OWNER_PRIVATE_KEY,
        process.env.GUARDIAN_1_PRIVATE_KEY,
        process.env.GUARDIAN_2_PRIVATE_KEY,
        process.env.GUARDIAN_3_PRIVATE_KEY,
      ],
    },
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY,
      ftmTestnet: process.env.FTMSCAN_API_KEY,
    },
  },
};
