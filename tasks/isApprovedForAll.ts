import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC721 } from "../typechain";

task(
  "isApprovedForAll",
  "Checks if an address is approved for all tokens of a specific owner"
)
  .addParam("contract", "The address of the ERC721 contract")
  .addParam("owner", "The token owner address")
  .addParam("operator", "The address to check for approval")
  .setAction(
    async (
      taskArgs: TaskArguments,
      hre: HardhatRuntimeEnvironment
    ): Promise<void> => {
      const erc721: MyERC721 = <MyERC721>(
        await hre.ethers.getContractAt("MyERC721", taskArgs.contract as string)
      );

      const owner = taskArgs.owner as string;
      const operator = taskArgs.operator as string;

      const isApproved = await erc721.isApprovedForAll(owner, operator);
      console.log(
        `Operatror ${operator} is ${
          isApproved ? "approved" : "not approved"
        } for all ERC721 tokens of ${owner}`
      );
    }
  );
