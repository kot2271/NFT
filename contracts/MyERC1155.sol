// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @dev Smart contract implementing ERC1155 token with specified functions.
 */
contract MyERC1155 is Context, IERC165, IERC1155, IERC1155MetadataURI, Ownable {
    using Strings for uint256;

    // Mapping to store token balances
    mapping(address => mapping(uint256 => uint256)) private _balances;

    // Mapping for operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    // Base URI for token metadata
    string private _baseURI;

    // Name of the token
    string private _name;

    /**
     * @dev Constructor to set the base URI.
     */
    constructor(string memory name_, string memory baseURI_) Ownable() {
        _name = name_;
        _baseURI = baseURI_;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override returns (bool) {
        return
            interfaceId == type(IERC1155).interfaceId ||
            interfaceId == type(IERC1155MetadataURI).interfaceId ||
            interfaceId == type(IERC165).interfaceId;
    }

    // ERC1155 functions

    /**
     * @dev Returns the balance of a specific token ID for a given address.
     * @param owner Address of the token holder.
     * @param id ID of the token.
     * @return Balance of the token ID for the address.
     */
    function balanceOf(
        address owner,
        uint256 id
    ) public view virtual override returns (uint256) {
        require((owner != address(0)), "ERC1155: address zero is not a valid owner");
        return _balances[owner][id];
    }

    /**
     * @dev Returns the balances of multiple token IDs for a list of addresses.
     * @param accounts List of addresses to check balances for.
     * @param ids List of token IDs to check.
     * @return List of balances for each address and token ID pair.
     */
    function balanceOfBatch(
        address[] memory accounts,
        uint256[] memory ids
    ) public view virtual override returns (uint256[] memory) {
        require(
            accounts.length == ids.length,
            "ERC1155: Mismatched account and ID lengths"
        );

        uint256[] memory balances = new uint256[](accounts.length);
        for (uint256 i = 0; i < accounts.length; i++) {
            balances[i] = balanceOf(accounts[i], ids[i]);
        }
        return balances;
    }

    /**
     * @dev Returns the URI for a specific token ID.
     * @param id ID of the token.
     * @return URI for the token metadata.
     */
    function uri(
        uint256 id
    ) public view virtual override returns (string memory) {
        return string(abi.encodePacked(_baseURI, Strings.toString(id)));
    }

    // ERC1155 approval functions

    /**
     * @dev Grants or revokes approval to an operator for all tokens of the caller.
     * @param operator Address of the operator to approve/unapprove.
     * @param approved Whether to approve or revoke approval.
     */
    function setApprovalForAll(
        address operator,
        bool approved
    ) public virtual override {
        require(
            owner() != operator,
            "ERC1155: setting approval status for self"
        );
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    /**
     * @dev Checks if an operator is approved to transfer tokens of a given address.
     * @param account Address of the token holder.
     * @param operator Address of the potential operator.
     * @return Whether the operator is approved for the account.
     */
    function isApprovedForAll(
        address account,
        address operator
    ) public view virtual override returns (bool) {
        return _operatorApprovals[account][operator];
    }

    // ERC1155 transfer functions

    /**
     * @dev Transfers a specific token ID from one address to another.
     * @param from Address of the token sender.
     * @param to Address of the token receiver.
     * @param id ID of the token to transfer.
     * @param value Number of tokens to transfer.
     * @param data Optional data for the receiver to interpret.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 value,
        bytes memory data
    ) public virtual override {
        _checkTransfer(from, to);

        _transfer(from, to, id, value);

        emit TransferSingle(msg.sender, from, to, id, value);

        // Check if recipient is a smart contract and call onERC1155Received if needed
        _onERC1155Received(from, to, id, value, data);
    }

    /**
     * @dev Transfers multiple token IDs from one address to another.
     * @param from Address of the token sender.
     * @param to Address of the token receiver.
     * @param ids List of token IDs to transfer.
     * @param values List of token amounts to transfer.
     * @param data Optional data for the receiver to interpret.
     */
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values,
        bytes memory data
    ) public virtual override {
        require(
            ids.length == values.length,
            "Mismatched IDs and values lengths"
        );
        _checkTransfer(from, to);

        // Update balances
        for (uint256 i = 0; i < ids.length; i++) {
            _transfer(from, to, ids[i], values[i]);
        }

        emit TransferBatch(msg.sender, from, to, ids, values);

        // Check if recipient is a smart contract and call onERC1155BatchReceived if needed
        _onERC1155BatchReceived(from, to, ids, values, data);
    }

    // Minting and burning functions

    /**
     * @dev Mints a new token ID with a specified amount to an address.
     * @param to Address to receive the minted tokens.
     * @param id ID of the token to mint.
     * @param value Number of tokens to mint.
     */
    function mint(address to, uint256 id, uint256 value) external onlyOwner {
        require(to != address(0), "ERC1155: 'to' is zero address");
        require(value > 0, "ERC1155: Value must be greater than 0");
        _balances[to][id] += value;
        emit TransferSingle(msg.sender, address(0), to, id, value);

        _onERC1155Received(address(0), to, id, value, "");
    }

    /**
     * @dev Burns a specific token ID from an address.
     * @param from Address of the token holder.
     * @param id ID of the token to burn.
     * @param value Number of tokens to burn.
     */
    function burn(address from, uint256 id, uint256 value) external onlyOwner {
        require(_balances[from][id] >= value, "ERC1155: insufficient balance");
        _balances[from][id] -= value;
        emit TransferSingle(msg.sender, from, address(0), id, value);
    }

    // Utility functions

    /**
     * @dev Checks if the transfer of tokens is valid.
     * @param from The address from which the tokens are being transferred.
     * @param to The address to which the tokens are being transferred.
     */
    function _checkTransfer(address from, address to) internal view {
        require(
            from == msg.sender || isApprovedForAll(from, msg.sender),
            "ERC1155: caller is not owner nor approved"
        );
        require(to != address(0), "ERC1155: transfer to zero address");
    }

    /**
     * @dev Internal function to transfer tokens from one address to another
     * @param _from The address to transfer tokens from
     * @param _to The address to transfer tokens to
     * @param _id The ID of the token to transfer
     * @param value The amount of tokens to transfer
     */
    function _transfer(
        address _from,
        address _to,
        uint256 _id,
        uint256 value
    ) internal {
        // Check sufficient balance
        uint256 fromBalance = _balances[_from][_id];
        require(
            fromBalance >= value,
            "ERC1155: insufficient balance for transfer"
        );

        // Update balances
        _balances[_from][_id] -= value;
        _balances[_to][_id] += value;
    }

    /**
     * @dev Checks if the given address is a contract
     * @param account The address to check
     * @return result true if the address is a contract, false otherwise
     */
    function isContract(address account) internal view returns (bool result) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        if (size > 0) {
            return true;
        }
    }

    /**
     * @dev Internal function to handle the ERC1155 token transfer.
     * This function is called when a token is received by a contract.
     * @param from The address sending the tokens.
     * @param to The address receiving the tokens.
     * @param id The ID of the token being transferred.
     * @param value The amount of tokens being transferred.
     * @param data Additional data to be passed to the recipient contract.
     * @return result A boolean indicating whether the transfer was successful.
     */
    function _onERC1155Received(
        address from,
        address to,
        uint256 id,
        uint256 value,
        bytes memory data
    ) private returns (bool result) {
        result = false;
        if (isContract(to)) {
            try
                IERC1155Receiver(to).onERC1155Received(
                    _msgSender(),
                    from,
                    id,
                    value,
                    data
                )
            returns (bytes4 response) {
                return
                    response == IERC1155Receiver(to).onERC1155Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert(
                        "ERC1155: transfer to non ERC1155Receiver recipient"
                    );
                }
            }
        } else {
            return true;
        }
    }

    /**
     * @dev Internal function to handle the batch transfer of ERC1155 tokens.
     * @param from The address which owns the tokens.
     * @param to The address to which the tokens are being transferred.
     * @param ids An array of token IDs to be transferred.
     * @param values An array of amounts to be transferred.
     * @param data Additional data with no specified format.
     * @return result A boolean indicating whether the transfer was successful or not.
     */
    function _onERC1155BatchReceived(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values,
        bytes memory data
    ) private returns (bool result) {
        result = false;
        if (isContract(to)) {
            try
                IERC1155Receiver(to).onERC1155BatchReceived(
                    msg.sender,
                    from,
                    ids,
                    values,
                    data
                )
            returns (bytes4 response) {
                return
                    response ==
                    IERC1155Receiver(to).onERC1155BatchReceived.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert(
                        "ERC1155: transfer batch to non ERC1155Receiver recipient"
                    );
                }
            }
        } else {
            return true;
        }
    }
}
