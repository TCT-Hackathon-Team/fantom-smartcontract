require("dotenv").config();

async function main() {
  const [owner, guard1, guard2, guard3] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", owner.address);

  console.log("Account balance:", (await owner.getBalance()).toString());

  /// Deploy Hash contract
  const Hash = await ethers.getContractFactory("Hash");
  const hash = await Hash.deploy();
  await hash.deployed();
  console.log("Hash address:", hash.address);

  /// Get hashes of the addresses
  const ownerHash = await hash.getHashOf(owner.address);
  const guard1Hash = await hash.getHashOf(guard1.address);
  const guard2Hash = await hash.getHashOf(guard2.address);
  const guard3Hash = await hash.getHashOf(guard3.address);

  console.log([guard1Hash, guard2Hash, guard3Hash]);

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
