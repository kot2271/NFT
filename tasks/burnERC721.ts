import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC721 } from "../typechain";
import { BigNumber } from "ethers";

task("burnERC721", "Burns a specific token")
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

      await erc721.burn(tokenId);

      const filter = erc721.filters.Transfer();
      const events = await erc721.queryFilter(filter);
      const txTokenId = events[0].args["tokenId"];

      console.log(`ERC721 Token ${txTokenId} successfully burned`);
    }
  );
