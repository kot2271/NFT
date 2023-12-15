# NFT

## Installation

Clone the repository using the following command:
Install the dependencies using the following command:
```shell
npm i
```

# ERC721 Token

## Deployment

Fill in all the required environment variables(copy .env-example to .env and fill it). 

Deploy contract to the chain (polygon-mumbai):
```shell
npx hardhat run scripts/deploy/erc721Deploy.ts --network polygonMumbai
```

## Verify

Verify the installation by running the following command:
```shell
npx hardhat verify --network polygonMumbai {CONTRACT_ADDRESS}
```

## Tasks

Create a new task(s) and save it(them) in the folder "tasks". Add a new task_name in the file "tasks/index.ts"

Running a mint task:
```shell
npx hardhat mint --contract {ERC721_CONTRACT_ADDRESS} --token-id {TOKEN_ID} --to {ADDRESS_TO_RECEIVE_TOKEN} --network polygonMumbai
```

Running a burn task:
```shell
npx hardhat burn --contract {ERC721_CONTRACT_ADDRESS} --token-id {TOKEN_ID} --network polygonMumbai
```

Running a tokenURI task:
```shell
npx hardhat tokenURI --contract {ERC721_CONTRACT_ADDRESS} --token-id {TOKEN_ID} --network polygonMumbai
```

Running a balanceOf task:
```shell
npx hardhat balanceOf --contract {ERC721_CONTRACT_ADDRESS} --address {ADDERSS_TO_CHECK} --network polygonMumbai
```

Running a ownerOf task:
```shell
npx hardhat ownerOf --contract {ERC721_CONTRACT_ADDRESS} --token-id {TOKEN_ID} --network polygonMumbai
```

Running a setApprovalForAll task:
```shell
npx hardhat setApprovalForAll --contract {ERC721_CONTRACT_ADDRESS} --operator {ADDRESS_TO_GRANT_APPROVAL} --approved {TRUE/FALSE} --network polygonMumbai
```

Running a isApprovedForAll task:
```shell
npx hardhat isApprovedForAll --contract {ERC721_CONTRACT_ADDRESS} --owner {TOKEN_OWNER_ADDRESS} --operator {ADDRESS_TO_GRANT_APPROVAL} --network polygonMumbai
```

Running a approve task:
```shell
npx hardhat approve --contract {ERC721_CONTRACT_ADDRESS} --to {ADDRESS_TO_GRANT_PERMISSION} --token-id {TOKEN_ID} --network polygonMumbai
```

Running a getApproved task:
```shell
npx hardhat getApproved --contract {ERC721_CONTRACT_ADDRESS} --token-id {TOKEN_ID} --network polygonMumbai
```

Running a transferFrom task:
```shell
npx hardhat transferFrom --contract {ERC721_CONTRACT_ADDRESS} --from {ADDRESS_CURRENTLY_HOLDING_TOKEN} --to {ADDRESS_TO_RECEIVE_TOKEN} --token-id {TOKEN_ID} --network polygonMumbai
```

Running a safeTransferFrom task:
```shell
npx hardhat safeTransferFrom --contract {ERC721_CONTRACT_ADDRESS} --from {ADDRESS_CURRENTLY_HOLDING_TOKEN} --to {ADDRESS_TO_RECEIVE_TOKEN} --token-id {TOKEN_ID} --network polygonMumbai
```

Running a safeTransferFromWithData task:
```shell
npx hardhat safeTransferFromWithData --contract {ERC721_CONTRACT_ADDRESS} --from {ADDRESS_CURRENTLY_HOLDING_TOKEN} --to {ADDRESS_TO_RECEIVE_TOKEN} --token-id {TOKEN_ID} --network polygonMumbai
```

Running a supportsInterface task:
```shell
npx hardhat supportsInterface --contract {ERC721_CONTRACT_ADDRESS} --interface-id {BYTES4_ID_OF_INTERFACE} --network polygonMumbai
```


