# NFT

## Installation

Clone the repository using the following command:
Install the dependencies using the following command:
```shell
npm i
```

# ERC721 Token

[![OpenSea](https://img.shields.io/badge/check_the_NFT_in_OpenSea-f2f3f4?style=flat&logo=opensea)](https://testnets.opensea.io/collection/myerc721-39)

[![Mumbai](https://img.shields.io/badge/check_the_contract_in_mumbai.polygonscan-9966cc?style=flat&logo=ethereum)](https://mumbai.polygonscan.com/address/0x71c4a39fBc494E27d969A62d36e95373B6317B0d)

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
npx hardhat mintERC721 --contract {ERC721_CONTRACT_ADDRESS} --token-id {TOKEN_ID} --to {ADDRESS_TO_RECEIVE_TOKEN} --token-uri {TOKEN_URI} --network polygonMumbai
```

Running a burn task:
```shell
npx hardhat burnERC721 --contract {ERC721_CONTRACT_ADDRESS} --token-id {TOKEN_ID} --network polygonMumbai
```

Running a tokenURI task:
```shell
npx hardhat tokenUriERC721 --contract {ERC721_CONTRACT_ADDRESS} --token-id {TOKEN_ID} --network polygonMumbai
```

Running a balanceOf task:
```shell
npx hardhat balanceOfERC721 --contract {ERC721_CONTRACT_ADDRESS} --address {ADDERSS_TO_CHECK} --network polygonMumbai
```

Running a ownerOf task:
```shell
npx hardhat ownerOfERC721 --contract {ERC721_CONTRACT_ADDRESS} --token-id {TOKEN_ID} --network polygonMumbai
```

Running a setApprovalForAll task:
```shell
npx hardhat setApprovalForAllERC721 --contract {ERC721_CONTRACT_ADDRESS} --operator {ADDRESS_TO_GRANT_APPROVAL} --approved {TRUE/FALSE} --network polygonMumbai
```

Running a isApprovedForAll task:
```shell
npx hardhat isApprovedForAllERC721 --contract {ERC721_CONTRACT_ADDRESS} --owner {TOKEN_OWNER_ADDRESS} --operator {ADDRESS_TO_GRANT_APPROVAL} --network polygonMumbai
```

Running a approve task:
```shell
npx hardhat approveERC721 --contract {ERC721_CONTRACT_ADDRESS} --to {ADDRESS_TO_GRANT_PERMISSION} --token-id {TOKEN_ID} --network polygonMumbai
```

Running a getApproved task:
```shell
npx hardhat getApprovedERC721 --contract {ERC721_CONTRACT_ADDRESS} --token-id {TOKEN_ID} --network polygonMumbai
```

Running a transferFrom task:
```shell
npx hardhat transferFromERC721 --contract {ERC721_CONTRACT_ADDRESS} --from {ADDRESS_CURRENTLY_HOLDING_TOKEN} --to {ADDRESS_TO_RECEIVE_TOKEN} --token-id {TOKEN_ID} --network polygonMumbai
```

Running a safeTransferFrom task:
```shell
npx hardhat safeTransferFromERC721 --contract {ERC721_CONTRACT_ADDRESS} --from {ADDRESS_CURRENTLY_HOLDING_TOKEN} --to {ADDRESS_TO_RECEIVE_TOKEN} --token-id {TOKEN_ID} --network polygonMumbai
```

Running a safeTransferFromWithData task:
```shell
npx hardhat safeTransferFromWithDataERC721 --contract {ERC721_CONTRACT_ADDRESS} --from {ADDRESS_CURRENTLY_HOLDING_TOKEN} --to {ADDRESS_TO_RECEIVE_TOKEN} --token-id {TOKEN_ID} --network polygonMumbai
```

Running a supportsInterface task:
```shell
npx hardhat supportsInterfaceERC721 --contract {ERC721_CONTRACT_ADDRESS} --interface-id {BYTES4_ID_OF_INTERFACE} --network polygonMumbai
```

# ERC1155 Token

[![OpenSea](https://img.shields.io/badge/check_the_NFT_in_OpenSea-f2f3f4?style=flat&logo=opensea)](https://testnets.opensea.io/collection/unidentified-contract-23ca945e-beb3-4eed-a577-82b3)

[![Mumbai](https://img.shields.io/badge/check_the_contract_in_mumbai.polygonscan-9966cc?style=flat&logo=ethereum)](https://mumbai.polygonscan.com/address/0x7B4d25e0DD2DcA44Ae850CC1E2dFeAF98b436027)

## Deployment

Fill in all the required environment variables(copy .env-example to .env and fill it). 

Deploy contract to the chain (polygon-mumbai):
```shell
npx hardhat run scripts/deploy/erc1155Deploy.ts --network polygonMumbai
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
npx hardhat mintERC1155 --contract {ERC1155_CONTRACT_ADDRESS} --token-id {TOKEN_ID} --to {ADDRESS_TO_RECEIVE_TOKEN} --amount {NUMBER_OF_TOKENS} --token-uri {TOKEN_URI} --network polygonMumbai
```

Running a balanceOf task:
```shell
npx hardhat balanceOfERC1155 --contract {ERC1155_CONTRACT_ADDRESS} --owner {ADDERSS_TO_CHECK} --token-id {TOKEN_ID} --network polygonMumbai
```

Running a safeTransferFrom task:
```shell
npx hardhat safeTransferFromERC1155 --contract {ERC1155_CONTRACT_ADDRESS} --from {ADDRESS_CURRENTLY_HOLDING_TOKEN} --to {ADDRESS_TO_RECEIVE_TOKEN} --token-id {TOKEN_ID} --amount {NUMBER_OF_TOKENS} --network polygonMumbai
```

Running a setApprovalForAll task:
```shell
npx hardhat setApprovalForAllERC1155 --contract {ERC1155_CONTRACT_ADDRESS} --owner {TOKEN_OWNER_ADDRESS} --operator {ADDRESS_TO_GRANT_APPROVAL} --approved {TRUE/FALSE} --network polygonMumbai
```

Running a safeBatchTransferFrom task:
```shell
npx hardhat safeBatchTransferFromERC1155 --contract {ERC1155_CONTRACT_ADDRESS} --from {ADDRESS_CURRENTLY_HOLDING_TOKEN} --to {ADDRESS_TO_RECEIVE_TOKEN} --token-ids {LIST_OF_TOKEN_IDS} --amounts {LIST_OF_AMOUNTS_TOKENS} --network polygonMumbai
```

Running a isApprovedForAll task:
```shell
npx hardhat isApprovedForAllERC1155 --contract {ERC1155_CONTRACT_ADDRESS} --owner {TOKEN_OWNER_ADDRESS} --operator {ADDRESS_TO_GRANT_APPROVAL} --network polygonMumbai
```

Running a burn task:
```shell
npx hardhat burnERC1155 --contract {ERC1155_CONTRACT_ADDRESS} --from {ADDRESS_CURRENTLY_HOLDING_TOKEN} --token-id {TOKEN_ID} --amount {NUMBER_OF_TOKENS} --network polygonMumbai
```

Running a supportsInterface task:
```shell
npx hardhat supportsInterfaceERC1155 --contract {ERC1155_CONTRACT_ADDRESS} --interface-id {BYTES4_ID_OF_INTERFACE} --network polygonMumbai
```

Running a tokenURI task:
```shell
npx hardhat tokenUriERC1155 --contract {ERC1155_CONTRACT_ADDRESS} --token-id {TOKEN_ID} --network polygonMumbai
```

MyERC1155_Contract: 0x7B4d25e0DD2DcA44Ae850CC1E2dFeAF98b436027