import { expect } from "chai";
import { ethers } from "hardhat";
import { MyERC721 } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("MyERC721", () => {
  let token: MyERC721;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("MyERC721");
    token = await Token.deploy("MyERC721", "MY721", "http://mytoken.io/");
    token.deployed();
  });

  describe("deploy", () => {
    it("Should set the right owner", async () => {
      expect(await token.owner()).to.equal(owner.address);
    });
  });

  describe("Metadata", () => {
    it("Should return correct name", async () => {
      const name = await token.name();
      expect(name).to.equal("MyERC721");
    });

    it("Should return correct symbol", async () => {
      const symbol = await token.symbol();
      expect(symbol).to.equal("MY721");
    });

    it("Should return token URI", async () => {
      await token.mint(owner.address, 1);
      const uri = await token.tokenURI(1);
      const expectedUri = "http://mytoken.io/1";
      expect(uri).to.equal(expectedUri);
    });
  });

  describe("mint", () => {
    it("Should mint token", async () => {
      await token.mint(user1.address, 1);
      expect(await token.ownerOf(1)).to.equal(user1.address);
      expect(await token.balanceOf(user1.address)).to.equal(1);
    });

    it("Should revert if `to` address is invalid (zero address)", async () => {
      await expect(
        token.connect(owner).mint(ethers.constants.AddressZero, 1)
      ).to.be.revertedWith("Invalid address");
    });

    it("Should revert if token with given ID already exists", async () => {
      await token.connect(owner).mint(user1.address, 1);
      await expect(
        token.connect(owner).mint(user2.address, 1)
      ).to.be.revertedWith("Token already exists");
    });

    it("Should revert mint if caller is not the owner", async () => {
      await expect(
        token.connect(user1).mint(user2.address, 1)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("burn", () => {
    it("Should burn token", async () => {
      await token.mint(user1.address, 1);
      await token.connect(owner).burn(1);
      expect(await token.balanceOf(user1.address)).to.equal(0);
      await expect(token.ownerOf(1)).to.be.revertedWith("Invalid token ID");
    });

    it("Should be reverted when caller is not the owner", async () => {
      await token.mint(user1.address, 1);
      await expect(token.connect(user1).burn(1)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("Should revert for non-existent token", async () => {
      await token.mint(owner.address, 1);
      await expect(token.burn(2)).to.be.revertedWith("Nonexistent token");
    });
  });

  describe("tokenURI", () => {
    it("Should revert for non-existent token", async () => {
      await expect(token.tokenURI(123)).to.be.revertedWith("Nonexistent token");
    });

    it("Should return metadata URI", async () => {
      await token.mint(owner.address, 1);
      const uri = "http://mytoken.io/1";
      expect(await token.tokenURI(1)).to.equal(uri);
    });
  });

  describe("balanceOf", () => {
    it("Should return zero for empty account", async () => {
      expect(await token.balanceOf(user1.address)).to.equal(0);
    });

    it("Should return count after minting", async () => {
      await token.mint(user1.address, 1);
      await token.mint(user1.address, 2);
      expect(await token.balanceOf(user1.address)).to.equal(2);
    });

    it("Should be reverted if zero address", async () => {
      await expect(token.balanceOf(ethers.constants.AddressZero)).revertedWith(
        "Address is zero"
      );
    });
  });

  describe("approve", () => {
    it("Should approve account", async () => {
      await token.mint(owner.address, 1);
      await token.approve(user1.address, 1);
      expect(await token.getApproved(1)).to.equal(user1.address);
    });

    it("Should set approval for all", async () => {
      await token.setApprovalForAll(user1.address, true);
      expect(
        await token.isApprovedForAll(owner.address, user1.address)
      ).to.equal(true);
    });

    it("Should revert when approving to current owner", async () => {
      await token.mint(owner.address, 1);
      await expect(token.approve(owner.address, 1)).to.be.revertedWith(
        "Approval to current owner"
      );
    });

    it("Should revert when not owner or approved for all", async () => {
      await token.mint(owner.address, 1);
      await expect(
        token.connect(user1).approve(user2.address, 1)
      ).to.be.revertedWith("Not authorized");
    });

    it("Should revert when owner is operator", async () => {
      await token.mint(owner.address, 1);
      await expect(
        token.connect(owner).setApprovalForAll(owner.address, true)
      ).to.be.revertedWith("Approve to caller");
    });

    it("Should set approval when owner", async () => {
      await token.mint(owner.address, 1);
      await token.approve(user1.address, 1);
      expect(await token.getApproved(1)).to.equal(user1.address);
    });

    it("Should set approval when owner mint token", async () => {
      await token.mint(owner.address, 1);
      await token.setApprovalForAll(user1.address, true);
      expect(
        await token.isApprovedForAll(owner.address, user1.address)
      ).to.equal(true);
    });

    it("Should revert for approve to the zero address", async () => {
      await token.mint(owner.address, 1);
      await expect(
        token.approve(ethers.constants.AddressZero, 1)
      ).to.be.revertedWith("Approve to the zero address");
    });

    it("Should revert for non-existent token", async () => {
      await expect(token.getApproved(123)).to.be.revertedWith(
        "Nonexistent token"
      );
    });

    it("Should return approved address after approval", async () => {
      await token.mint(owner.address, 1);
      await token.approve(user1.address, 1);
      expect(await token.getApproved(1)).to.equal(user1.address);
    });

    it("Should return zero address without approval", async () => {
      await token.mint(owner.address, 1);
      expect(await token.getApproved(1)).to.equal(ethers.constants.AddressZero);
    });
  });

  describe("transferFrom", () => {
    it("Should transfer token", async () => {
      await token.mint(owner.address, 1);
      await token.transferFrom(owner.address, user1.address, 1);
      expect(await token.ownerOf(1)).to.equal(user1.address);
    });

    it("Should fail if not owner or approved", async () => {
      await token.mint(owner.address, 1);
      await expect(
        token.connect(user1).transferFrom(owner.address, user1.address, 1)
      ).to.be.revertedWith("Not approved");
    });

    it("Should fail for invalid token ID", async () => {
      await expect(
        token.transferFrom(owner.address, user1.address, 123)
      ).to.be.revertedWith("Nonexistent token");
    });

    it("Should fail if transferring to zero address", async () => {
      await token.mint(owner.address, 1);
      await expect(
        token.transferFrom(owner.address, ethers.constants.AddressZero, 1)
      ).to.be.revertedWith("Invalid address");
    });

    it("Should revert if sender is not owner", async () => {
      await token.mint(owner.address, 1);
      await expect(
        token.connect(user1).transferFrom(user1.address, user2.address, 1)
      ).to.be.revertedWith("Not owner");
    });

    it("Should handle operator approvals", async () => {
      await token.mint(owner.address, 1);
      await token.setApprovalForAll(user1.address, true);
      await token.connect(user1).transferFrom(owner.address, user2.address, 1);
      expect(await token.ownerOf(1)).to.equal(user2.address);
    });

    it("Should transfer token with operator approval", async () => {
      await token.mint(owner.address, 1);
      await token.approve(user1.address, 1);
      await token.connect(user1).transferFrom(owner.address, user2.address, 1);
      expect(await token.ownerOf(1)).to.equal(user2.address);
    });

    it("Should succeed if sender is approved for token", async () => {
      await token.mint(owner.address, 1);
      await token.connect(owner).approve(user1.address, 1);
      await expect(
        token.connect(user1).transferFrom(owner.address, user2.address, 1)
      ).to.not.be.reverted;
    });

    it("Should succeed if sender is approved for all tokens", async () => {
      await token.mint(owner.address, 1);
      await token.connect(owner).setApprovalForAll(user1.address, true);
      await expect(
        token.connect(user1).transferFrom(owner.address, user2.address, 1)
      ).to.not.be.reverted;
    });
  });

  describe("safeTransferFrom", () => {
    it("Should transfer token", async () => {
      await token.mint(owner.address, 1);
      await token["safeTransferFrom(address,address,uint256)"](
        owner.address,
        user1.address,
        1
      );
      expect(await token.ownerOf(1)).to.equal(user1.address);
    });

    it("Should revert if token doesn't exist", async () => {
      const nonExistentTokenId = 100;
      await expect(
        token
          .connect(owner)
          ["safeTransferFrom(address,address,uint256,bytes)"](
            owner.address,
            user1.address,
            nonExistentTokenId,
            ethers.utils.formatBytes32String("foo")
          )
      ).to.be.revertedWith("Nonexistent token");
    });

    it("Should revert if sender is not owner", async () => {
      await token.mint(owner.address, 1);
      await expect(
        token
          .connect(user1)
          ["safeTransferFrom(address,address,uint256,bytes)"](
            user1.address,
            user2.address,
            1,
            ethers.utils.formatBytes32String("foo")
          )
      ).to.be.revertedWith("Not owner");
    });

    it("Should revert if sender is not approved", async () => {
      await token.mint(owner.address, 1);
      await expect(
        token
          .connect(user2)
          ["safeTransferFrom(address,address,uint256,bytes)"](
            owner.address,
            user1.address,
            1,
            ethers.utils.formatBytes32String("foo")
          )
      ).to.be.revertedWith("Not approved");
    });

    it("Should succeed if sender is approved for token (getApproved(tokenId) == _msgSender())", async () => {
      await token.mint(owner.address, 1);
      await token.connect(owner).approve(user1.address, 1);
      await expect(
        token
          .connect(user1)
          ["safeTransferFrom(address,address,uint256,bytes)"](
            owner.address,
            user2.address,
            1,
            ethers.utils.formatBytes32String("foo")
          )
      ).to.not.be.reverted;
    });

    it("Should succeed if sender is not approved for token, but approved for all", async () => {
      await token.mint(owner.address, 1);
      await token.connect(owner).setApprovalForAll(user1.address, true);
      await expect(
        token
          .connect(user1)
          ["safeTransferFrom(address,address,uint256,bytes)"](
            owner.address,
            user2.address,
            1,
            ethers.utils.formatBytes32String("foo")
          )
      ).to.not.be.reverted;
    });

    it("Should work with data", async () => {
      await token.mint(owner.address, 1);
      await token["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        user1.address,
        1,
        ethers.utils.formatBytes32String("foo")
      );
      expect(await token.ownerOf(1)).to.equal(user1.address);
    });

    it("Should revert on contract without onERC721Received", async () => {
      const invalidContract = await (
        await ethers.getContractFactory("InvalidERC721Receiver")
      ).deploy();
      await token.mint(user1.address, 1);

      await expect(
        token
          .connect(user1)
          ["safeTransferFrom(address,address,uint256,bytes)"](
            user1.address,
            invalidContract.address,
            1,
            ethers.utils.formatBytes32String("foo")
          )
      ).to.be.revertedWith(
        "ERC721: transfer to non ERC721Receiver implementer"
      );
    });
  });

  describe("supportsInterface", () => {
    it("Should support IERC165", async () => {
      expect(await token.supportsInterface("0x01ffc9a7")).to.equal(true);
    });

    it("Should support IERC721", async () => {
      expect(await token.supportsInterface("0x80ac58cd")).to.equal(true);
    });

    it("Should support IERC721Metadata", async () => {
      expect(await token.supportsInterface("0x5b5e139f")).to.equal(true);
    });
  });

  describe("_checkOnERC721Received", () => {
    it("Should allow ERC721Receiver contract receive", async () => {
      const receiver = await (
        await ethers.getContractFactory("ERC721ReceiverMock")
      ).deploy();

      await token.mint(owner.address, 1);

      await expect(
        token["safeTransferFrom(address,address,uint256)"](
          owner.address,
          receiver.address,
          1
        )
      )
        .to.emit(token, "Transfer")
        .withArgs(owner.address, receiver.address, 1);
    });
  });
});
