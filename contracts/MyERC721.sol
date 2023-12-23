// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyERC721
 * @dev This contract implements the ERC721 standard for non-fungible tokens.
 */
contract MyERC721 is Context, IERC165, IERC721, IERC721Metadata, Ownable {
    using Strings for uint256;

    // Token name
    string private _name;

    // Token symbol
    string private _symbol;

    // Mapping from token ID to token URI
    mapping(uint256 => string) private _tokenURIs;

    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;

    // Mapping owner address to token count
    mapping(address => uint256) private _balances;

    // Mapping from token ID to approved address
    mapping(uint256 => address) private _tokenApprovals;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    constructor(string memory name_, string memory symbol_) Ownable() {
        _name = name_;
        _symbol = symbol_;
    }

    /**
     * @dev Checks whether the contract supports a given interface.
     * @param interfaceId The interface identifier.
     * @return A boolean indicating whether the contract supports the interface.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override returns (bool) {
        return
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
            interfaceId == type(IERC165).interfaceId;
    }

    /**
     * @param owner The address to query the balance of.
     * @return The number of tokens owned by `owner`.
     */
    function balanceOf(
        address owner
    ) public view virtual override returns (uint256) {
        require(owner != address(0), "Address is zero");
        return _balances[owner];
    }

    /**
     * @param tokenId The token identifier.
     * @return The address of the owner of the token.
     */
    function ownerOf(
        uint256 tokenId
    ) public view virtual override returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "Invalid token ID");
        return owner;
    }

    /**
     * @return The name of the token.
     */
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /**
     * @return The symbol of the token.
     */
    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    /**
     * @param tokenId The token identifier.
     * @return The URI for the given token.
     */
    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(_exists(tokenId), "Nonexistent token");
        string memory _tokenURI = _tokenURIs[tokenId];
        return _tokenURI;
    }

    /**
     * @dev Approves another address to transfer the given token.
     * @param to The address to approve.
     * @param tokenId The token identifier.
     */
    function approve(address to, uint256 tokenId) public virtual override {
        require(to != address(0), "Approve to the zero address");
        address owner = ownerOf(tokenId);
        require(to != owner, "Approval to current owner");

        require(_msgSender() == owner, "Not authorized");

        _tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    /**
     * @param tokenId The token identifier.
     * @return The approved address for the given token.
     */
    function getApproved(
        uint256 tokenId
    ) public view virtual override returns (address) {
        require(_exists(tokenId), "Nonexistent token");
        return _tokenApprovals[tokenId];
    }

    /**
     * @dev Sets or unsets the approval of a given operator.
     * @param operator The operator address.
     * @param approved Whether to approve or unapprove the operator.
     */
    function setApprovalForAll(
        address operator,
        bool approved
    ) public virtual override {
        _setApprovalForAll(_msgSender(), operator, approved);
    }

    /**
     * @param owner The owner address.
     * @param operator The operator address.
     * @return Whether the operator is approved for the given owner.
     */
    function isApprovedForAll(
        address owner,
        address operator
    ) public view virtual override returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    /**
     * @dev Transfers the ownership of a given token to another address.
     * @param from The current owner address.
     * @param to The new owner address.
     * @param tokenId The token identifier.
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        // Check that token exists
        require(_exists(tokenId), "Nonexistent token");

        // Check that sender is owner or approved
        require(ownerOf(tokenId) == from, "Not owner");
        require(
            _msgSender() == from ||
                (getApproved(tokenId) == _msgSender() ||
                    isApprovedForAll(from, _msgSender())),
            "Not approved"
        );

        _transfer(from, to, tokenId);
    }

    /**
     * @dev Safely transfers the ownership of a given token to another address.
     * @param from The current owner address.
     * @param to The new owner address.
     * @param tokenId The token identifier.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        safeTransferFrom(from, to, tokenId, "");
    }

    /**
     * @dev Safely transfers the ownership of a given token to another address.
     * @param from The current owner address.
     * @param to The new owner address.
     * @param tokenId The token identifier.
     * @param data Additional data.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public virtual override {
        require(_exists(tokenId), "Nonexistent token");
        require(ownerOf(tokenId) == from, "Not owner");
        require(
            _msgSender() == from ||
                (getApproved(tokenId) == _msgSender() ||
                    isApprovedForAll(from, _msgSender())),
            "Not approved"
        );

        _safeTransfer(from, to, tokenId, data);
    }

    /**
     * @dev Mints a new token with the given token ID and assigns it to an address.
     * @param to The address to assign the token to.
     * @param tokenId The token identifier.
     */
    function mint(
        address to,
        uint256 tokenId,
        string memory _tokenURI
    ) external onlyOwner {
        require(to != address(0), "Invalid address");
        require(!_exists(tokenId), "Token already exists");
        _tokenURIs[tokenId] = _tokenURI;

        _mint(to, tokenId);
    }

    /**
     * @dev Burns a token with the given token ID.
     * @param tokenId The token identifier.
     */
    function burn(uint256 tokenId) external onlyOwner {
        require(_exists(tokenId), "Nonexistent token");

        _burn(tokenId);
    }

    /**
     * @dev Internal function to mint a new token.
     * @param to The address to assign the token to.
     * @param tokenId The token identifier.
     */
    function _mint(address to, uint256 tokenId) internal virtual {
        _balances[to]++;
        _owners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);
    }

    /**
     * @dev Internal function to burn a token.
     * @param tokenId The token identifier.
     */
    function _burn(uint256 tokenId) internal virtual {
        address owner = ownerOf(tokenId);

        _approve(address(0), tokenId);

        _balances[owner]--;
        delete _owners[tokenId];

        emit Transfer(owner, address(0), tokenId);
    }

    /**
     * @dev Internal function to transfer a token from one address to another.
     * @param from The current owner address.
     * @param to The new owner address.
     * @param tokenId The token identifier.
     */
    function _transfer(address from, address to, uint256 tokenId) internal {
        require(to != address(0), "Invalid address");

        _approve(address(0), tokenId);

        _balances[from]--;
        _balances[to]++;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    /**
     * @dev Internal function to approve an address to transfer a given token.
     * @param to The address to approve.
     * @param tokenId The token identifier.
     */
    function _approve(address to, uint256 tokenId) internal {
        _tokenApprovals[tokenId] = to;
        emit Approval(ownerOf(tokenId), to, tokenId);
    }

    /**
     * @dev Internal function to set or unset the approval of a given operator.
     * @param owner The owner address.
     * @param operator The operator address.
     * @param approved Whether to approve or unapprove the operator.
     */
    function _setApprovalForAll(
        address owner,
        address operator,
        bool approved
    ) internal {
        require(owner != operator, "Approve to caller");
        _operatorApprovals[owner][operator] = approved;
        emit ApprovalForAll(owner, operator, approved);
    }

    /**
     * @dev Internal function to safely transfer a token from one address to another.
     * @param from The current owner address.
     * @param to The new owner address.
     * @param tokenId The token identifier.
     * @param data Additional data.
     */
    function _safeTransfer(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) internal {
        _transfer(from, to, tokenId);
        require(
            _checkOnERC721Received(from, to, tokenId, data),
            "Unsafe receiver"
        );
    }

    /**
     * @dev Internal function to check if a given token exists.
     * @param tokenId The token identifier.
     * @return Whether the token exists.
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _owners[tokenId] != address(0);
    }

    /**
     * @dev Internal function to check if the receiver contract supports ERC721.
     * @param from The sender address.
     * @param to The receiver address.
     * @param tokenId The token identifier.
     * @param data Additional data.
     */
    function _checkOnERC721Received(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) private returns (bool result) {
        result = false;
        uint256 size;
        assembly {
            size := extcodesize(to)
        }
        if (size > 0) {
            try
                IERC721Receiver(to).onERC721Received(
                    _msgSender(),
                    from,
                    tokenId,
                    data
                )
            returns (bytes4 retval) {
                return retval == IERC721Receiver(to).onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert(
                        "ERC721: transfer to non ERC721Receiver implementer"
                    );
                }
            }
        } else {
            return true;
        }
    }
}
