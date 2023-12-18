import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC1155 } from "../typechain";

task("tokenUriERC1155", "Gets the URI for a specific token ID")
  .addParam("contract", "The address of the MyERC1155 contract")
  .addParam("tokenId", "The ID of the token")
  .setAction(
    async (
      taskArgs: TaskArguments,
      hre: HardhatRuntimeEnvironment
    ): Promise<void> => {
      const erc1155: MyERC1155 = <MyERC1155>(
        await hre.ethers.getContractAt("MyERC1155", taskArgs.contract as string)
      );

      const tokenId = taskArgs.tokenId as number;

      const uri = await erc1155.uri(tokenId);

      console.log(`The URI for ERC1155 token ID ${tokenId} is: ${uri}`);
    }
  );
