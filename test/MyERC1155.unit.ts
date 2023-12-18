import { expect } from "chai";
import { ethers } from "hardhat";
import { MyERC1155, ERC1155ReceiverMock } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("MyERC1155", () => {
  let token: MyERC1155;
  let receiverMock: ERC1155ReceiverMock;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("MyERC1155");
    token = await Token.deploy("MyERC1155", "http://mytoken.io/");
    token.deployed();

    receiverMock = await (
      await ethers.getContractFactory("ERC1155ReceiverMock")
    ).deploy();
    receiverMock.deployed();
  });

  describe("deploy", () => {
    it("Should set the right owner", async () => {
      expect(await token.owner()).to.equal(owner.address);
    });

    it("sets base URI", async () => {
      const uri = await token.uri(1);
      expect(uri).to.equal("http://mytoken.io/1");
    });
  });

  describe("uri", () => {
    it("should return the correct URI for various token IDs", async () => {
      const uri1 = await token.uri(1);
      const uri2 = await token.uri(2);
      expect(uri1).to.equal("http://mytoken.io/1");
      expect(uri2).to.equal("http://mytoken.io/2");
    });
  });

  describe("supportsInterface", () => {
    it("should support required ERC1155 interfaces", async () => {
      const erc1155Interface = await token.supportsInterface("0xd9b67a26");
      const metadataInterface = await token.supportsInterface("0x0e89341c");
      const erc165Interface = await token.supportsInterface("0x01ffc9a7");
      expect(erc1155Interface).to.be.true;
      expect(metadataInterface).to.be.true;
      expect(erc165Interface).to.be.true;
    });

    it("should correctly identify supported and unsupported interfaces", async () => {
      const randomInterface = "0x424c945e";
      const supportedInterface = "0xd9b67a26";
      const erc1155Interface = await token.supportsInterface(
        supportedInterface
      );
      const randomInterfaceSupport = await token.supportsInterface(
        randomInterface
      );
      expect(erc1155Interface).to.be.true;
      expect(randomInterfaceSupport).to.be.false;
    });
  });

  describe("balanceOf", () => {
    it("returns zero for unused token ID", async () => {
      const balance = await token.balanceOf(owner.address, 1);
      expect(balance).to.equal(0);
    });

    it("should return the correct balance of tokens for an address", async () => {
      // Mint some tokens for account1
      await token.mint(user1.address, 1, 10);

      // Check the balance of account1 for token ID 1
      const balance = await token.balanceOf(user1.address, 1);
      expect(balance).to.equal(10);
    });
  });

  describe("balanceOfBatch", () => {
    it("should return balances for multiple token IDs for different accounts", async () => {
      await token.mint(owner.address, 11, 10);
      await token.mint(user1.address, 12, 5);
      const balances = await token.balanceOfBatch(
        [owner.address, user1.address],
        [11, 12]
      );
      expect(balances[0]).to.equal(10);
      expect(balances[1]).to.equal(5);
    });

    it("should revert 'balanceOfBatch' with mismatched address and ID lengths", async () => {
      await expect(
        token.balanceOfBatch([owner.address], [11, 12, 13])
      ).to.be.revertedWith("ERC1155: Mismatched account and ID lengths");
    });

    it("should revert 'balanceOfBatch' with address zero", async () => {
      await token.mint(owner.address, 11, 10);
      await token.mint(user1.address, 12, 5);
      await expect(
        token.balanceOfBatch(
          [owner.address, ethers.constants.AddressZero],
          [11, 12]
        )
      ).to.be.revertedWith("ERC1155: address zero is not a valid owner");
    });
  });

  describe("mint", () => {
    it("should mint tokens for different accounts and token IDs", async () => {
      await token.mint(user1.address, 1, 10);
      const balance1 = await token.balanceOf(user1.address, 1);
      expect(balance1).to.equal(10);

      await token.mint(user2.address, 2, 5);
      const balance2 = await token.balanceOf(user2.address, 2);
      expect(balance2).to.equal(5);
    });

    it("should revert when caller is not the owner", async () => {
      await expect(
        token.connect(user1).mint(user1.address, 1, 10)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert when mint to zero address", async () => {
      const AddressZero = ethers.constants.AddressZero;
      await expect(token.mint(AddressZero, 1, 10)).to.be.revertedWith(
        "ERC1155: 'to' is zero address"
      );
    });

    it("should revert when value is zero", async () => {
      await expect(token.mint(owner.address, 1, 0)).to.be.revertedWith(
        "ERC1155: Value must be greater than 0"
      );
    });
  });

  describe("burn", () => {
    it("should burn tokens for different accounts and token IDs", async () => {
      await token.mint(user1.address, 1, 10);
      const balance1 = await token.balanceOf(user1.address, 1);
      expect(balance1).to.equal(10);

      await token.burn(user1.address, 1, 5);
      const balance2 = await token.balanceOf(user1.address, 1);
      expect(balance2).to.equal(5);
    });

    it("should revert when insufficient balance", async () => {
      await token.mint(user1.address, 1, 1);
      await expect(token.burn(user1.address, 1, 2)).to.be.revertedWith(
        "ERC1155: insufficient balance"
      );
    });

    it("should revert burning for caller is not the owner", async () => {
      await token.mint(owner.address, 4, 15);
      await expect(
        token.connect(user1).burn(owner.address, 4, 5)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("checkTransfer", () => {
    const data = ethers.utils.formatBytes32String("bar");
    it("should revert when insufficient balance for transfer", async () => {
      const unauthorizedContract = await (
        await ethers.getContractFactory("InvalidERC1155Receiver")
      ).deploy();
      await expect(
        token.safeTransferFrom(
          owner.address,
          unauthorizedContract.address,
          1,
          1,
          data
        )
      ).to.be.revertedWith("ERC1155: insufficient balance for transfer");
    });

    it("should revert transfer for caller is not the owner", async () => {
      await token.mint(owner.address, 1, 2);
      const unauthorizedContract = await (
        await ethers.getContractFactory("InvalidERC1155Receiver")
      ).deploy();
      await expect(
        token
          .connect(user1)
          .safeTransferFrom(
            owner.address,
            unauthorizedContract.address,
            1,
            1,
            data
          )
      ).to.be.revertedWith("ERC1155: caller is not owner nor approved");
    });
  });

  describe("safeTransferFrom", () => {
    it("should transfer tokens successfully between accounts", async () => {
      const tokenId = 2;
      const data = ethers.utils.formatBytes32String("bar");
      // Mint some tokens for owner
      await token.mint(owner.address, tokenId, 5);

      // Approve account1 to transfer tokens on behalf of owner
      await token.connect(owner).setApprovalForAll(user1.address, true);

      // Transfer 3 tokens from owner to account2
      await token
        .connect(user1)
        .safeTransferFrom(owner.address, user2.address, tokenId, 3, data);

      // Check the balances
      const ownerBalance = await token.balanceOf(owner.address, tokenId);
      expect(ownerBalance).to.equal(2);
      const account2Balance = await token.balanceOf(user2.address, tokenId);
      expect(account2Balance).to.equal(3);
    });

    it("Should revert on contract without onERC1155Received", async () => {
      const invalidContract = await (
        await ethers.getContractFactory("InvalidERC1155Receiver")
      ).deploy();
      await token.mint(user1.address, 1, 1);

      await expect(
        token
          .connect(user1)
          .safeTransferFrom(
            user1.address,
            invalidContract.address,
            1,
            1,
            ethers.utils.formatBytes32String("bar")
          )
      ).to.be.revertedWith(
        "ERC1155: transfer to non ERC1155Receiver recipient"
      );
    });

    it("Should allow ERC1155Receiver contract receive", async () => {
      const data = ethers.utils.formatBytes32String("bar");

      await token.mint(owner.address, 1, 1);

      await expect(
        token
          .connect(owner)
          .safeTransferFrom(owner.address, receiverMock.address, 1, 1, data)
      )
        .to.emit(token, "TransferSingle")
        .withArgs(owner.address, owner.address, receiverMock.address, 1, 1);
    });

    it("should revert 'safeTransferFrom' with insufficient balance", async () => {
      const data = ethers.utils.formatBytes32String("bar");
      await token.mint(owner.address, 2, 2);
      await expect(
        token
          .connect(user1)
          .safeTransferFrom(user1.address, owner.address, 2, 1, data)
      ).to.be.revertedWith("ERC1155: insufficient balance for transfer");
    });

    it("should revert 'safeTransferFrom' with zero address recipient", async () => {
      const data = ethers.utils.formatBytes32String("bar");
      const AddressZero = ethers.constants.AddressZero;
      await token.mint(owner.address, 7, 3);
      await expect(
        token.safeTransferFrom(owner.address, AddressZero, 7, 2, data)
      ).to.be.revertedWith("ERC1155: transfer to zero address");
    });
  });

  describe("safeBatchTransferFrom", () => {
    const data1 = ethers.utils.formatBytes32String("foo");
    const data2 = ethers.utils.formatBytes32String("bar");
    it("should handle batch transfers with various data parameters and sizes", async () => {
      await token.mint(owner.address, 9, 12);
      await token.mint(owner.address, 10, 8);
      await token.safeBatchTransferFrom(
        owner.address,
        user1.address,
        [9, 10],
        [6, 2],
        data1
      );
      await token.safeBatchTransferFrom(
        owner.address,
        user2.address,
        [10, 9],
        [3, 5],
        data2
      );
      const balance19 = await token.balanceOf(user1.address, 9);
      const balance110 = await token.balanceOf(user1.address, 10);
      const balance29 = await token.balanceOf(user2.address, 9);
      const balance210 = await token.balanceOf(user2.address, 10);
      expect(balance19).to.equal(6);
      expect(balance110).to.equal(2);
      expect(balance29).to.equal(5);
      expect(balance210).to.equal(3);
    });

    it("should revert when mismatched IDs and values lengths", async () => {
      await token.mint(owner.address, 1, 2);
      await token.mint(owner.address, 2, 2);
      await expect(
        token.safeBatchTransferFrom(
          owner.address,
          user1.address,
          [1, 2],
          [1, 2, 3],
          data1
        )
      ).to.be.revertedWith("Mismatched IDs and values lengths");
    });

    it("should revert 'safeBatchTransferFrom' with insufficient balance", async () => {
      await token.mint(owner.address, 15, 3);
      await expect(
        token.safeBatchTransferFrom(
          owner.address,
          user1.address,
          [15],
          [4],
          data1
        )
      ).to.be.revertedWith("ERC1155: insufficient balance for transfer");
    });

    it("should revert 'safeBatchTransferFrom' with zero address recipient", async () => {
      await token.mint(owner.address, 16, 7);
      await expect(
        token.safeBatchTransferFrom(
          owner.address,
          ethers.constants.AddressZero,
          [16],
          [3],
          data2
        )
      ).to.be.revertedWith("ERC1155: transfer to zero address");
    });

    it("should revert with non-compliant recipient", async () => {
      const invalidContract = await (
        await ethers.getContractFactory("InvalidERC1155Receiver")
      ).deploy();
      await token.mint(owner.address, 3, 7);
      await expect(
        token.safeBatchTransferFrom(
          owner.address,
          invalidContract.address,
          [3],
          [3],
          data1
        )
      ).to.be.revertedWith(
        "ERC1155: transfer batch to non ERC1155Receiver recipient"
      );
    });

    it("should revert with zero address recipient", async () => {
      await token.mint(owner.address, 4, 9);
      await expect(
        token.safeBatchTransferFrom(
          owner.address,
          ethers.constants.AddressZero,
          [4],
          [4],
          data1
        )
      ).to.be.revertedWith("ERC1155: transfer to zero address");
    });

    it("should revert with insufficient balance", async () => {
      await token.mint(owner.address, 5, 3);
      await expect(
        token.safeBatchTransferFrom(
          owner.address,
          receiverMock.address,
          [5],
          [4],
          data1
        )
      ).to.be.revertedWith("ERC1155: insufficient balance for transfer");
    });

    it("Should allow ERC1155BatchReceived contract receive", async () => {
      await token.mint(owner.address, 9, 12);
      await token.mint(owner.address, 10, 8);
      await expect(
        token.safeBatchTransferFrom(
          owner.address,
          receiverMock.address,
          [9, 10],
          [6, 2],
          data1
        )
      )
        .to.emit(token, "TransferBatch")
        .withArgs(
          owner.address,
          owner.address,
          receiverMock.address,
          [9, 10],
          [6, 2]
        );
    });
  });

  describe("approval", () => {
    it("should revert 'setApprovalForAll' with approval for self", async () => {
      await token.mint(owner.address, 2, 2);
      await expect(
        token.setApprovalForAll(owner.address, true)
      ).to.be.revertedWith("ERC1155: setting approval status for self");
    });

    it("should set individual approvals for specific operators and tokens", async () => {
      await token.mint(owner.address, 5, 7);
      await token.setApprovalForAll(user1.address, true);
      await token.setApprovalForAll(user2.address, true);
      const approved1 = await token.isApprovedForAll(
        owner.address,
        user1.address
      );
      const approved2 = await token.isApprovedForAll(
        owner.address,
        user2.address
      );
      expect(approved1).to.be.true;
      expect(approved2).to.be.true;
    });

    it("should revoke and check approval status", async () => {
      await token.mint(owner.address, 6, 8);
      await token.setApprovalForAll(user1.address, true);
      await token.setApprovalForAll(user1.address, false);
      const approved = await token.isApprovedForAll(
        owner.address,
        user1.address
      );
      expect(approved).to.be.false;
    });
  });
});
