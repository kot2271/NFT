import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC721 } from "../typechain";
import { BigNumber } from "ethers";

task("mint", "Mints a new token to a specific address")
  .addParam("contract", "The address of the ERC721 contract")
  .addParam("tokenId", "The token ID to mint")
  .addParam("to", "The address to receive the token")
  .setAction(
    async (
      taskArgs: TaskArguments,
      hre: HardhatRuntimeEnvironment
    ): Promise<void> => {
      const erc721: MyERC721 = <MyERC721>(
        await hre.ethers.getContractAt("MyERC721", taskArgs.contract as string)
      );

      const addressTo = taskArgs.to as string;
      const tokenId: BigNumber = taskArgs.tokenId;
      await erc721.mint(addressTo, tokenId);

      const filter = erc721.filters.Transfer();
      const events = await erc721.queryFilter(filter);
      const txTokenId = events[0].args["tokenId"];
      const txAddressTo = events[0].args["to"];

      console.log(
        `ERC721 Token with ID ${txTokenId} minted for address ${txAddressTo}`
      );
    }
  );
