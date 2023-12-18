import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC721 } from "../typechain";
import { BigNumber } from "ethers";
import { encodeFunctionCall } from "web3-eth-abi";

task(
  "safeTransferFromWithDataERC721",
  "Safely transfers a token from one address to another with data"
)
  .addParam("contract", "The address of the ERC721 contract")
  .addParam("from", "The address currently holding the token")
  .addParam("to", "The address to receive the token")
  .addParam("tokenId", "The ID of the token to transfer")
  .setAction(
    async (
      taskArgs: TaskArguments,
      hre: HardhatRuntimeEnvironment
    ): Promise<void> => {
      const erc721: MyERC721 = <MyERC721>(
        await hre.ethers.getContractAt("MyERC721", taskArgs.contract as string)
      );

      const calldata = encodeFunctionCall(
        {
          name: "myMethod",
          type: "function",
          inputs: [
            {
              type: "uint256",
              name: "myNumber",
            },
            {
              type: "string",
              name: "myString",
            },
          ],
        },
        ["2345675643", "Hello!%"]
      );
      const addressFrom = taskArgs.from as string;
      const addressTo = taskArgs.to as string;
      const tokenId: BigNumber = taskArgs.tokenId;
      const data = calldata || "";

      await erc721["safeTransferFrom(address,address,uint256,bytes)"](
        addressFrom,
        addressTo,
        tokenId,
        data
      );

      const filter = erc721.filters.Transfer();
      const events = await erc721.queryFilter(filter);
      const txAddressFrom = events[0].args["from"];
      const txAddressTo = events[0].args["to"];
      const txTokenId = events[0].args["tokenId"];

      console.log(
        `ERC721 Token ${txTokenId} safely transferred from ${txAddressFrom} to ${txAddressTo} with data: ${data.toString()}`
      );
    }
  );
