import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC721 } from "../typechain";

task(
  "setApprovalForAll",
  "Grants approval for all tokens to a specific address"
)
  .addParam("contract", "The address of the ERC721 contract")
  .addParam("operator", "The address to grant approval to")
  .addParam("approved", "Whether to grant approval (true) or revoke it (false)")
  .setAction(
    async (
      taskArgs: TaskArguments,
      hre: HardhatRuntimeEnvironment
    ): Promise<void> => {
      const erc721: MyERC721 = <MyERC721>(
        await hre.ethers.getContractAt("MyERC721", taskArgs.contract as string)
      );

      const operator = taskArgs.operator as string;
      const approved = taskArgs.approved as boolean;

      await erc721.setApprovalForAll(operator, approved);

      const filter = erc721.filters.ApprovalForAll();
      const events = await erc721.queryFilter(filter);
      const txOwner = events[0].args["owner"];
      const txOperator = events[0].args["operator"];
      const txApproved = events[0].args["approved"];

      console.log(
        `Approval for all ERC721 tokens from ${txOwner} to ${txOperator} is now ${
          txApproved ? "granted" : "revoked"
        }`
      );
    }
  );
