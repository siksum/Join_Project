//SPDX-License Identifier: MIT
pragma solidity ^0.7.0;

contract TxOrigin {

    address payable owner;

    constructor() public{ owner = msg.sender; }

    function bug0() internal{
        require(tx.origin == owner);
    }

    function bug2() public{
        if (tx.origin != owner) {
            revert();
        }
    }

    function legit0() public{
        require(tx.origin == msg.sender);
    }
    
    // function legit1() public{
    //     tx.origin.transfer(tx.origin, address(this).balance);
    // }
    
}
