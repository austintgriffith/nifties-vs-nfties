const fs = require('fs');
module.exports = {
  'openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol': fs.readFileSync('openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol', 'utf8'),
  'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol': fs.readFileSync('openzeppelin-solidity/contracts/token/ERC721/ERC721.sol', 'utf8'),
  'openzeppelin-solidity/contracts/token/ERC721/ERC721BasicToken.sol': fs.readFileSync('openzeppelin-solidity/contracts/token/ERC721/ERC721BasicToken.sol', 'utf8'),
  'openzeppelin-solidity/contracts/introspection/SupportsInterfaceWithLookup.sol': fs.readFileSync('openzeppelin-solidity/contracts/introspection/SupportsInterfaceWithLookup.sol', 'utf8'),
  'openzeppelin-solidity/contracts/token/ERC721/ERC721Basic.sol': fs.readFileSync('openzeppelin-solidity/contracts/token/ERC721/ERC721Basic.sol', 'utf8'),
  'openzeppelin-solidity/contracts/token/ERC721/ERC721Receiver.sol': fs.readFileSync('openzeppelin-solidity/contracts/token/ERC721/ERC721Receiver.sol', 'utf8'),
  'openzeppelin-solidity/contracts/math/SafeMath.sol': fs.readFileSync('openzeppelin-solidity/contracts/math/SafeMath.sol', 'utf8'),
  'openzeppelin-solidity/contracts/AddressUtils.sol': fs.readFileSync('openzeppelin-solidity/contracts/AddressUtils.sol', 'utf8'),
  'openzeppelin-solidity/contracts/introspection/ERC165.sol': fs.readFileSync('openzeppelin-solidity/contracts/introspection/ERC165.sol', 'utf8'),
}
