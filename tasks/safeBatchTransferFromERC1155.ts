import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { MyERC1155 } from "../typechain";
import { BigNumber } from "ethers";
import { encodeFunctionCall } from "web3-eth-abi";

task(
  "safeBatchTransferFromERC1155",
  "Transfers multiple token IDs from one address to another"
)
  .addParam("contract", "The address of the MyERC1155 contract")
  .addParam("from", "The address sending the tokens")
  .addParam("to", "The address receiving the tokens")
  .addParam("tokenIds", "List of token IDs to transfer (comma-separated)")
  .addParam(
    "amounts",
    "List of corresponding amounts to transfer (comma-separated)"
  )
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
      const tokenIds = taskArgs.tokenIds
        .split(",")
        .map((id: any) => BigNumber.from(id));
      const amounts = taskArgs.amounts
        .split(",")
        .map((amount: any) => BigNumber.from(amount));
      const data = calldata || "";

      await erc1155.safeBatchTransferFrom(
        addressFrom,
        addressTo,
        tokenIds,
        amounts,
        data
      );

      console.log(`Transferred ${
        tokenIds.length
      } ERC1155 tokens to ${addressTo}:
        ${tokenIds
          .map(
            (id: BigNumber, i: string | number) => `- ID ${id} x ${amounts[i]}`
          )
          .join("\n")}`);
    }
  );
