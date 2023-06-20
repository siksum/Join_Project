// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        uint256 c = a - b;
        return c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: division by zero");
        uint256 c = a / b;
        return c;
    }
}

contract MyContract {
    using SafeMath for uint256;
    
    uint256 public totalSupply;
    
    mapping(address => uint256) public balances;
    
    function mint(uint256 amount) public {
        totalSupply = totalSupply.add(amount);
        balances[msg.sender] = balances[msg.sender].add(amount);
    }
    
    function transfer(address to, uint256 amount) public {
        require(amount <= balances[msg.sender], "Insufficient balance");
        
        balances[msg.sender] = balances[msg.sender].sub(amount);
        balances[to] = balances[to].add(amount);
    }
    
    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }
}