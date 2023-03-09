require("dotenv").config();
// const { utils } = require("ethers");

async function main() {
  const [owner, guard1, guard2, guard3] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", owner.address);

  console.log("Account balance:", (await owner.getBalance()).toString());

  const ownerHash = ethers.utils.solidityKeccak256(
    ["address"],
    [owner.address]
  );
  const guard1Hash = ethers.utils.solidityKeccak256(
    ["address"],
    [guard1.address]
  );
  const guard2Hash = ethers.utils.solidityKeccak256(
    ["address"],
    [guard2.address]
  );
  const guard3Hash = ethers.utils.solidityKeccak256(
    ["address"],
    [guard3.address]
  );

  /// Deploy Wallet contract
  const Wallet = await ethers.getContractFactory("Wallet");
  hardhatWallet = await Wallet.deploy([guard1Hash, guard2Hash, guard3Hash], 1);

  await hardhatWallet.deployed();
  console.log("Hardhat wallet address:", hardhatWallet.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
