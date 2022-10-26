// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract CreateNFT is ERC721URIStorage {
  uint256 private s_tokenCounter;

  event Minted(uint256 indexed tokenId);

  constructor() ERC721("NewWeb", "NewWeb") {
    s_tokenCounter = 0;
  }

  function mintNft(string memory ourTokenUri) public {
    _safeMint(msg.sender, s_tokenCounter);
    _setTokenURI(s_tokenCounter, ourTokenUri);

    emit Minted(s_tokenCounter);

    s_tokenCounter = s_tokenCounter + 1;
  }

  function getTokenCounter() public view returns (uint256) {
    return s_tokenCounter;
  }
}
