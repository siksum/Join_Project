// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Overflow {
    uint public sellerBalance=0;
    
    function add(uint value) public {
        sellerBalance += value;
    } 
}