import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC721 } from "../typechain";
import { BigNumber } from "ethers";

task(
  "approveERC721",
  "Grants another address permission to transfer a specific token"
)
  .addParam("contract", "The address of the ERC721 contract")
  .addParam("to", "The address to grant permission")
  .addParam("tokenId", "The ID of the token")
  .setAction(
    async (
      taskArgs: TaskArguments,
      hre: HardhatRuntimeEnvironment
    ): Promise<void> => {
      const erc721: MyERC721 = <MyERC721>(
        await hre.ethers.getContractAt("MyERC721", taskArgs.contract as string)
      );

      const addressTo = taskArgs.to as string;
      const tokenId: BigNumber = taskArgs.tokenId;

      await erc721.approve(addressTo, tokenId);

      const filter = erc721.filters.Approval();
      const events = await erc721.queryFilter(filter);
      const txOwner = events[0].args["owner"];
      const txApprovedTo = events[0].args["approved"];
      const txTokenId = events[0].args["tokenId"];

      console.log(
        `Address ${txOwner} granted permission to transfer ERC721 token ${txTokenId} to ${txApprovedTo}`
      );
    }
  );
