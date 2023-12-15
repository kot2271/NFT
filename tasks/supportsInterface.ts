import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC721 } from "../typechain";

task(
  "supportsInterface",
  "Checks if the contract supports a specific interface"
)
  .addParam("contract", "The address of the ERC721 contract")
  .addParam("interfaceId", "The bytes4 identifier of the interface")
  .setAction(
    async (
      taskArgs: TaskArguments,
      hre: HardhatRuntimeEnvironment
    ): Promise<void> => {
      const erc721: MyERC721 = <MyERC721>(
        await hre.ethers.getContractAt("MyERC721", taskArgs.contract as string)
      );

      const interfaceId = taskArgs.interfaceId as string;

      const isSupported = await erc721.supportsInterface(interfaceId);
      console.log(
        `Contract supports interface ${interfaceId}: ${
          isSupported ? "Yes" : "No"
        }`
      );
    }
  );
