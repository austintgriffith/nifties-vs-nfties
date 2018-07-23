pragma solidity ^0.4.24;

/*
  ERC-721 NIFTY remote hackaton for:
  https://github.com/austintgriffith/nifties-vs-nfties

  This Token is for the Nifties (yes eye in Nifties) monsters

  They have the following metadata:
  struct Token{
    uint8 body;
    uint8 feet;
    uint8 head;
    uint8 mouth;
    uint64 birthBlock;
  }
*/

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';

contract Nifties is ERC721Token {

  constructor() public ERC721Token("Nifties","NIFTIES") { }

  struct Token{
    uint8 body;
    uint8 feet;
    uint8 head;
    uint8 mouth;
    uint64 birthBlock;
  }

  Token[] private tokens;

  //Anyone can pay the gas to create their very own Tester token
  function create() public returns (uint256 _tokenId) {

    bytes32 sudoRandomButTotallyPredictable = keccak256(abi.encodePacked(totalSupply(),blockhash(block.number - 1)));
    uint8 body = (uint8(sudoRandomButTotallyPredictable[0])%5)+1;
    uint8 feet = (uint8(sudoRandomButTotallyPredictable[1])%7)+1;
    uint8 head = (uint8(sudoRandomButTotallyPredictable[2])%7)+1;
    uint8 mouth = (uint8(sudoRandomButTotallyPredictable[3])%8)+1;

    //this is about half of all the gas it takes because I'm doing some string manipulation
    //I could skip this, or make it way more efficient but the is just a silly hackathon project
    string memory tokenUri = createTokenUri(body,feet,head,mouth);

    Token memory _newToken = Token({
        body: body,
        feet: feet,
        head: head,
        mouth: mouth,
        birthBlock: uint64(block.number)
    });
    _tokenId = tokens.push(_newToken) - 1;
    _mint(msg.sender,_tokenId);
    _setTokenURI(_tokenId, tokenUri);
    emit Create(_tokenId,msg.sender,body,feet,head,mouth,_newToken.birthBlock,tokenUri);
    return _tokenId;
  }

  event Create(
    uint _id,
    address indexed _owner,
    uint8 _body,
    uint8 _feet,
    uint8 _head,
    uint8 _mouth,
    uint64 _birthBlock,
    string _uri
  );

  //Get any token metadata by passing in the ID
  function get(uint256 _id) public view returns (address owner,uint8 body,uint8 feet,uint8 head,uint8 mouth,uint64 birthBlock) {
    return (
      tokenOwner[_id],
      tokens[_id].body,
      tokens[_id].feet,
      tokens[_id].head,
      tokens[_id].mouth,
      tokens[_id].birthBlock
    );
  }

  function tokensOfOwner(address _owner) public view returns(uint256[]) {
    return ownedTokens[_owner];
  }

  function createTokenUri(uint8 body,uint8 feet,uint8 head,uint8 mouth) internal returns (string){
    string memory uri = "https://nifties.io/tokens/nifties-";
    uri = appendUint8ToString(uri,body);
    uri = strConcat(uri,"-");
    uri = appendUint8ToString(uri,feet);
    uri = strConcat(uri,"-");
    uri = appendUint8ToString(uri,head);
    uri = strConcat(uri,"-");
    uri = appendUint8ToString(uri,mouth);
    uri = strConcat(uri,".png");
    return uri;
  }

  function appendUint8ToString(string inStr, uint8 v) internal constant returns (string str) {
        uint maxlength = 100;
        bytes memory reversed = new bytes(maxlength);
        uint i = 0;
        while (v != 0) {
            uint remainder = v % 10;
            v = v / 10;
            reversed[i++] = byte(48 + remainder);
        }
        bytes memory inStrb = bytes(inStr);
        bytes memory s = new bytes(inStrb.length + i);
        uint j;
        for (j = 0; j < inStrb.length; j++) {
            s[j] = inStrb[j];
        }
        for (j = 0; j < i; j++) {
            s[j + inStrb.length] = reversed[i - 1 - j];
        }
        str = string(s);
    }

    function strConcat(string _a, string _b) internal pure returns (string) {
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        string memory ab = new string(_ba.length + _bb.length);
        bytes memory bab = bytes(ab);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) bab[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) bab[k++] = _bb[i];
        return string(bab);
    }

}
