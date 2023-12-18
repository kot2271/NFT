import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC1155 } from "../typechain";
import { BigNumber } from "ethers";

task(
  "balanceOfERC1155",
  "Checks the balance of a specific token for an address"
)
  .addParam("contract", "The address of the MyERC1155 contract")
  .addParam("owner", "The address to check the balance for")
  .addParam("tokenId", "The ID of the token")
  .setAction(
    async (
      taskArgs: TaskArguments,
      hre: HardhatRuntimeEnvironment
    ): Promise<void> => {
      const erc1155: MyERC1155 = <MyERC1155>(
        await hre.ethers.getContractAt("MyERC1155", taskArgs.contract as string)
      );

      const owner = taskArgs.owner as string;
      const tokenId = taskArgs.tokenId as BigNumber;

      const balance = await erc1155.balanceOf(owner, tokenId);

      console.log(
        `Address ${owner} has ${balance} ERC1155 token(s) with ID ${tokenId}`
      );
    }
  );
