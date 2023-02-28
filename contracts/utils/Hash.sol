// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Hash {
    /** dev: keccak256 hash of the address
     *  @param addr: address to hash
     *  @return bytes32: hash of the address
     */
    function getHashOf(address addr) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(addr));
    }
}
