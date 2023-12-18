import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC721 } from "../typechain";
import { BigNumber } from "ethers";

task("ownerOfERC721", "Shows the owner of a specific token")
  .addParam("contract", "The address of the ERC721 contract")
  .addParam("tokenId", "The ID of the token")
  .setAction(
    async (
      taskArgs: TaskArguments,
      hre: HardhatRuntimeEnvironment
    ): Promise<void> => {
      const erc721: MyERC721 = <MyERC721>(
        await hre.ethers.getContractAt("MyERC721", taskArgs.contract as string)
      );

      const tokenId: BigNumber = taskArgs.tokenId;
      const owner = await erc721.ownerOf(tokenId);
      console.log(`ERC721 Token ${tokenId} is owned by address ${owner}`);
    }
  );
