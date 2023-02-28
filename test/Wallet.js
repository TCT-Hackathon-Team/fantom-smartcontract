const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Hash contract", function () {
  it("Should return the right hash", async function () {
    const [owner, newOwner, guard_1, guard_2, guard_3] =
      await ethers.getSigners();

    const Hash = await ethers.getContractFactory("Hash");

    const hash = await Hash.deploy();

    await hash.deployed();

    expect(
      await hash.getHashOf("0xFABB0ac9d68B0B445fB7357272Ff202C5651694a")
    ).to.equal(
      "0x5a5a0bfe5b28876719f44ffd00b38943066eb7f5a0e1bda30fd2fc927ea8550e"
    );
  });
});

describe("Wallet contract", function () {
  let hardhatWallet;
  let owner, newOwner, guard1, guard2, guard3;
  let ownerHash, newOwnerHash, guard1Hash, guard2Hash, guard3Hash;
  beforeEach(async function () {
    /// Deploy Hash contract
    const Hash = await ethers.getContractFactory("Hash");
    const hash = await Hash.deploy();
    await hash.deployed();

    /// Get hashes of the addresses
    [owner, newOwner, guard1, guard2, guard3] = await ethers.getSigners();
    ownerHash = await hash.getHashOf(owner.address);
    newOwnerHash = await hash.getHashOf(newOwner.address);
    guard1Hash = await hash.getHashOf(guard1.address);
    guard2Hash = await hash.getHashOf(guard2.address);
    guard3Hash = await hash.getHashOf(guard3.address);

    /// Deploy Wallet contract
    const Wallet = await ethers.getContractFactory("Wallet");
    hardhatWallet = await Wallet.deploy(
      [guard1Hash, guard2Hash, guard3Hash],
      1
    );

    await hardhatWallet.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const walletOwner = await hardhatWallet.owner();
      expect(walletOwner).to.equal(owner.address);
    });
  });

  describe("Transactions", function () {
    it("Should allow owner to deposit", async function () {
      await hardhatWallet.connect(owner).deposit({ value: 100 });
      expect(await hardhatWallet.getBalance()).to.equal(100);
    });

    it("Should allow owner to withdraw", async function () {
      await hardhatWallet.connect(owner).deposit({ value: 100 });
      await hardhatWallet.connect(owner).withdraw(100);

      const walletBalance = await hardhatWallet.getBalance();
      expect(walletBalance).to.equal(0);
    });
  });

  describe("Guardians", function () {
    describe("Guardian management", function () {
      it("Should allow owner to add a guardian", async function () {
        await hardhatWallet.connect(owner).addGuardian(guard1.address);
        const isGuardian = await hardhatWallet.isGuardian(guard1Hash);
        expect(isGuardian).to.equal(true);
      });
    });

    describe("Recovery process", function () {
      it("Should allow guardians to initiate a recovery", async function () {
        await hardhatWallet.connect(owner).deposit({ value: 100 });
        await hardhatWallet.connect(guard1).initiateRecovery(newOwner.address);

        const isRecovering = await hardhatWallet.inRecovery();
        expect(isRecovering).to.equal(true);
      });

      it("Should allow owner to cancel a recovery", async function () {
        await hardhatWallet.connect(owner).deposit({ value: 100 });
        await hardhatWallet.connect(guard1).initiateRecovery(newOwner.address);
        await hardhatWallet.connect(owner).cancelRecovery();

        const isRecovering = await hardhatWallet.inRecovery();
        expect(isRecovering).to.equal(false);
      });

      it("Should allow guardians to support a recovery", async function () {
        await hardhatWallet.connect(owner).deposit({ value: 100 });
        await hardhatWallet.connect(guard1).initiateRecovery(newOwner.address);
        await hardhatWallet.connect(guard2).supportRecovery(newOwner.address);

        [ownerAddress, currRecoveryRound, isUsed] =
          await hardhatWallet.getGuardianRecovery(guard2.address);

        expect(ownerAddress).to.equal(newOwner.address);
      });

      it("Should allow owner to execute a recovery", async function () {
        await hardhatWallet.connect(owner).deposit({ value: 100 });
        await hardhatWallet.connect(guard1).initiateRecovery(newOwner.address);
        await hardhatWallet.connect(guard2).supportRecovery(newOwner.address);
        // await hardhatWallet.connect(guard1).executeRecovery(newOwner.address);
        await hardhatWallet
          .connect(guard1)
          ["executeRecovery(address)"](newOwner.address);

        const walletOwner = await hardhatWallet.owner();
        expect(walletOwner).to.equal(newOwner.address);
      });
    });
  });
});
