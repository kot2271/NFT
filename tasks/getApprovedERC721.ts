import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC721 } from "../typechain";
import { BigNumber } from "ethers";

task("getApprovedERC721", "Gets the address approved for a specific token")
  .addParam("contract", "The address of the ERC721 contract")
  .addParam("tokenId", "The token ID")
  .setAction(
    async (
      taskArgs: TaskArguments,
      hre: HardhatRuntimeEnvironment
    ): Promise<void> => {
      const erc721: MyERC721 = <MyERC721>(
        await hre.ethers.getContractAt("MyERC721", taskArgs.contract as string)
      );

      const tokenId: BigNumber = taskArgs.tokenId;
      const approvedAddress = await erc721.getApproved(tokenId);

      console.log(
        `Address approved for ERC721token ${tokenId}: ${approvedAddress}`
      );
    }
  );
