pragma solidity 0.7.0;

contract someContract {
    address public owner;
    address payable dest;
    address payable somewhere;
    uint256 public amount = 0;
    uint256 public answer = 15;

    constructor() {
        owner = msg.sender;
    }
    
    function setDest() public {
        dest = msg.sender;
    }
    
    // Code quality vulnerabilities
    
    function doSomething() public payable {
        // Tautologies
        if (true) {
            amount = msg.value;
            dest.transfer(amount);
        }
        if (answer < 25) {
            // Arbitrary destinations
            dest.transfer(address(this).balance);
        }
    }
    
    // Lost contracts
    function transferNowhere() public payable {
        somewhere.transfer(msg.value);
    }
    
    // Unprotected self-destruct
    function kill() public {
        //require(msg.sender == owner);
        selfdestruct(dest);
    }
}
