pragma solidity >=0.4.16 <0.9.0;

import "./ERC721Full.sol";

contract MemoryToken is ERC721Full {
  constructor() ERC721Full("Memory Token", "MEMORY") public{
  }

  function mint(address _to , string memory tokenURI) public{
    uint _tokenId = totalSupply().add(1);
    _mint(_to, _tokenId);
    _setTokenURI(_tokenId, tokenURI);
    return;
  }
}
