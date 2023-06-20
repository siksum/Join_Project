//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract C {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }
    
    function I_am_a_backdoor() public {
        selfdestruct(msg.sender);
    }
}
