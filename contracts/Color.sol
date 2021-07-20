pragma solidity 0.5.1;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";

contract Color is ERC721Full{
    string [] public colors;
    mapping(string => bool) _colorExists;

    constructor() public ERC721Full("Color", "COL"){}

    function mint (string memory _color) public{
        require(!_colorExists[_color], 'Color Exists Already');
        uint _id = colors.push(_color);
        _mint(msg.sender, _id);
        _colorExists[_color] = true;
    }
}

