# Social Recovery Smart Contract

This project is a smart contract designed to implement social recovery for a user's Ethereum wallet. Social recovery allows a user to recover access to their wallet in the event that they lose their private key or it is compromised, by enlisting the help of their trusted friends or family members.

The project uses Hardhat as the development framework and is written in Solidity. The contract includes the following features:

## Features

Ability for the user to designate a set of "guardians" who will be responsible for approving the recovery process.
The user can define a minimum threshold of guardian approvals required for recovery to proceed.
The guardians will receive an email notification when they are added to the user's recovery contract, and another notification when they are needed to approve a recovery request.
The recovery process can only be initiated by the user, and requires a designated waiting period before the guardians can approve the request.
The guardians must each approve the recovery request within the specified time frame before the recovery can proceed.
The contract includes a function to revoke a guardian's approval and remove them from the list of designated guardians.

## Installation

```
npm install
```

## Usage

- Compile contract

```
npx hardhat compile
```

- Test contract

```
npx hardhat test
```
- Deploy contract
```
npx hardhat run scripts/deploy.js --network <network-name>
```
- Verify contract

  - Check network supported

  ```bash
  npx hardhat verify --list-networks
  ```

  - Add networkScan API

  ```javascript
  {
    ...
    etherscan: {
      apiKey: {
        ftmTestnet: 'your API key'
      }
    }
  }
  ```

  - Verify contract

  ```bash
  npx hardhat verify --network <network> <contract_address>
  ```

  or

  ```bash
  npx hardhat verify --contract contracts/YourContractFile.sol:YourContractName --constructor-args scripts/argument.js --network testnet {contract address}
  ```
