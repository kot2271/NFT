import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC1155 } from "../typechain";

task(
  "setApprovalForAllERC1155",
  "Manage approvals for all tokens of an address"
)
  .addParam("contract", "The address of the MyERC1155 contract")
  .addParam("owner", "The address granting or revoking approval")
  .addParam("operator", "The address of the potential operator")
  .addParam("approved", "Whether to grant or revoke approval (true/false)")
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
      const approved = taskArgs.approved as boolean;

      const action = approved ? "approving" : "revoking";

      await erc1155.setApprovalForAll(operator, approved);

      console.log(
        `Successfully ${action} all ERC1155 token approvals for ${operator} by ${owner}`
      );
    }
  );
