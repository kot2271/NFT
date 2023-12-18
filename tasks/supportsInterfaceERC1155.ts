import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC1155 } from "../typechain";

task(
  "supportsInterfaceERC1155",
  "Checks if the contract implements a specific interface"
)
  .addParam("contract", "The address of the MyERC1155 contract")
  .addParam("interfaceId", "The bytes4 value of the interface to check")
  .setAction(
    async (
      taskArgs: TaskArguments,
      hre: HardhatRuntimeEnvironment
    ): Promise<void> => {
      const erc1155: MyERC1155 = <MyERC1155>(
        await hre.ethers.getContractAt("MyERC1155", taskArgs.contract as string)
      );

      const interfaceId = taskArgs.interfaceId as string;

      const isSupported = await erc1155.supportsInterface(interfaceId);

      console.log(
        `MyERC1155 ${
          isSupported ? "supports" : "does not support"
        } interface with ID: ${interfaceId}`
      );
    }
  );
