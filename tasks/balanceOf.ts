import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC721 } from "../typechain";

task("balanceOf", "Checks the balance of a specific address")
  .addParam("contract", "The address of the ERC721 contract")
  .addParam("address", "The address to check")
  .setAction(
    async (
      taskArgs: TaskArguments,
      hre: HardhatRuntimeEnvironment
    ): Promise<void> => {
      const erc721: MyERC721 = <MyERC721>(
        await hre.ethers.getContractAt("MyERC721", taskArgs.contract as string)
      );

      const addressToCheck = taskArgs.address as string;
      const balance = await erc721.balanceOf(addressToCheck);
      console.log(`Address ${addressToCheck} holds ${balance} ERC721 tokens`);
    }
  );
