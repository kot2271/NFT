import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC721 } from "../typechain";
import { BigNumber } from "ethers";

task("tokenUriERC721", "Fetches the token URI for a specific token")
  .addParam("contract", "The address of the ERC721 contract")
  .addParam("tokenId", "The token ID")
  .setAction(
    async (
      taskArgs: TaskArguments,
      hre: HardhatRuntimeEnvironment
    ): Promise<void> => {
      const erc721: MyERC721 = <MyERC721>(
        await hre.ethers.getContractAt("MyERC721", taskArgs.contract as string)
      );
      const tokenId: BigNumber = taskArgs.tokenId;
      const tokenURI = await erc721.tokenURI(tokenId);

      console.log(`Token URI for ERC721 token ${tokenId}: ${tokenURI}`);
    }
  );
