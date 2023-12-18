import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC1155 } from "../typechain";

task(
  "isApprovedForAllERC1155",
  "Checks if an operator is approved for all tokens of an address"
)
  .addParam("contract", "The address of the MyERC1155 contract")
  .addParam("owner", "The address to check approval for")
  .addParam("operator", "The address of the potential operator")
  .setAction(
    async (
      taskArgs: TaskArguments,
      hre: HardhatRuntimeEnvironment
    ): Promise<void> => {
      const erc1155: MyERC1155 = <MyERC1155>(
        await hre.ethers.getContractAt("MyERC1155", taskArgs.contract as string)
      );

      const owner = taskArgs.owner as string;
      const operator = taskArgs.operator as string;

      const isApproved = await erc1155.isApprovedForAll(owner, operator);

      console.log(
        `${operator} is ${
          isApproved ? "" : "not"
        } approved for all ERC1155 tokens of ${owner}`
      );
    }
  );
