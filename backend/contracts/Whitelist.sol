// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Whitelist {
  uint8 public maxWhitelistAddresses;
  uint8 public numAddressesWhitelisted;
  mapping (address => bool) public whitelistAddresses;

  constructor(uint8 _maxWhitelistAddresses) {
    maxWhitelistAddresses = _maxWhitelistAddresses;
  }

  function addAddressToWhitelist() public {
    require(!whitelistAddresses[msg.sender], "Sender has been already whitelisted");
    require(numAddressesWhitelisted < maxWhitelistAddresses, "More addresses can't be added, limit reached");
    whitelistAddresses[msg.sender] = true;
    numAddressesWhitelisted += 1;
  }
}
