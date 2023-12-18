import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC1155 } from "../typechain";
import { BigNumber } from "ethers";

task("burnERC1155", "Burn a specific amount of a token ID from an address")
  .addParam("contract", "The address of the MyERC1155 contract")
  .addParam("from", "The address burning the token")
  .addParam("tokenId", "The ID of the token to burn")
  .addParam("amount", "The number of tokens to burn")
  .setAction(
    async (
      taskArgs: TaskArguments,
      hre: HardhatRuntimeEnvironment
    ): Promise<void> => {
      const erc1155: MyERC1155 = <MyERC1155>(
        await hre.ethers.getContractAt("MyERC1155", taskArgs.contract as string)
      );

      const addressFrom = taskArgs.from as string;
      const tokenId = taskArgs.tokenId as BigNumber;
      const amount = taskArgs.amount as BigNumber;

      await erc1155.burn(addressFrom, tokenId, amount);

      console.log(
        `Successfully burned ${amount} ERC1155 token(s) with ID ${tokenId} from ${addressFrom}`
      );
    }
  );
