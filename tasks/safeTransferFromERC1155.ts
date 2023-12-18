import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC1155 } from "../typechain";
import { BigNumber } from "ethers";
import { encodeFunctionCall } from "web3-eth-abi";

task(
  "safeTransferFromERC1155",
  "Transfers a token ID from one address to another"
)
  .addParam("contract", "The address of the MyERC1155 contract")
  .addParam("from", "The address sending the token")
  .addParam("to", "The address receiving the token")
  .addParam("tokenId", "The ID of the token to transfer")
  .addParam("amount", "The number of tokens to transfer")
  .setAction(
    async (
      taskArgs: TaskArguments,
      hre: HardhatRuntimeEnvironment
    ): Promise<void> => {
      const erc1155: MyERC1155 = <MyERC1155>(
        await hre.ethers.getContractAt("MyERC1155", taskArgs.contract as string)
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
      const tokenId = taskArgs.tokenId as BigNumber;
      const amount = taskArgs.amount as BigNumber;
      const data = calldata || "";

      await erc1155.safeTransferFrom(
        addressFrom,
        addressTo,
        tokenId,
        amount,
        data
      );

      console.log(
        `Transferred ${amount} ERC1155 token(s) of ID ${tokenId} from ${addressFrom} to ${addressTo}`
      );
    }
  );
