import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC1155 } from "../typechain";
import { BigNumber } from "ethers";

task("mintERC1155", "Mints a specific token ID to an address")
  .addParam("contract", "The address of the MyERC1155 contract")
  .addParam("tokenId", "The ID of the token to mint")
  .addParam("to", "The address to receive the minted token")
  .addParam("amount", "The number of tokens to mint")
  .addParam("tokenUri", "The token URI for a specific token")
  .setAction(
    async (
      taskArgs: TaskArguments,
      hre: HardhatRuntimeEnvironment
    ): Promise<void> => {
      const erc1155: MyERC1155 = <MyERC1155>(
        await hre.ethers.getContractAt("MyERC1155", taskArgs.contract as string)
      );

      const addressTo = taskArgs.to as string;
      const tokenId = taskArgs.tokenId as BigNumber;
      const amount = taskArgs.amount as BigNumber;
      const tokenURI = taskArgs.tokenUri as string;

      await erc1155.mint(addressTo, tokenId, amount, tokenURI);

      console.log(
        `Minted ${amount} ERC1155 token(s) with ID ${tokenId} to address ${addressTo}`
      );
    }
  );
