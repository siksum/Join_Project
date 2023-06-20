pragma solidity ^0.4.11;

 contract MerdeToken {
   event Mint(address indexed to, uint256 amount);
   using SafeMath for uint256;

   bool public mintingFinished = false;
   uint256 public totalSupply;
   mapping(address => bool) allowedMinters;
   mapping(address => uint256) balances;

   modifier canMint() {
     require(!mintingFinished);
     _;
   }

   modifier isMinter() {
     require(allowedMinters[msg.sender]);
     _;
   }

   function mint(address _to, uint256 _amount)
       isMinter
       canMint
       public
       returns (bool)
   {
       totalSupply = totalSupply.add(_amount);
       balances[_to] = balances[_to].add(_amount);
       Mint(_to, _amount);
       return true;
   }
 }

library SafeMath {
  function mul(uint256 a, uint256 b) internal constant returns (uint256) {
    uint256 c = a * b;
    assert(a == 0 || c / a == b);
    return c;
  }

  function add(uint256 a, uint256 b) internal constant returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}

 contract Presale {
  using SafeMath for uint256;

    event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

   MerdeToken public merdeToken;
   uint256 public startBlock;
   uint256 public endBlock;
   address public wallet;
   address public owner;
   uint256 public price;
   uint256 public weiRaised;
   mapping(address => bool) public whiteListed;

   enum Stages {
       SaleDeployed,
       SaleSetUp,
       SaleStarted,
       SaleEnded
   }

   modifier beforeStart() {
       require(block.number < startBlock);
       _;
   }

   modifier afterEnd() {
       require(block.number > endBlock);
       _;
   }

   modifier isOwner(){
     require(msg.sender == owner);
     _;
   }

   modifier isWhitelisted() {
     require(whiteListed[msg.sender]);
     _;
   }

   function Presale(uint256 _startBlock, uint256 _endBlock, address _wallet, uint _price) {
     require(_startBlock >= block.number);
     require(_endBlock >= _startBlock);
     require(_price > 0);

     owner = msg.sender;
     startBlock = _startBlock;
     endBlock = _endBlock;
     price = _price;
     wallet = _wallet;
   }

   function () payable {
     buyTokens(msg.sender);
   }

   function buyTokens(address beneficiary) payable {
     require(beneficiary != 0x0);
     require(validPurchase());

     uint256 weiAmount = msg.value;

     uint256 tokens = weiAmount.mul(price);

     weiRaised = weiRaised.add(weiAmount);

     merdeToken.mint(beneficiary, tokens);
     TokenPurchase(msg.sender, beneficiary, weiAmount, tokens);

   }

   function validPurchase() internal constant returns (bool) {
     uint256 current = block.number;
     bool withinPeriod = current >= startBlock && current <= endBlock;
     bool nonZeroPurchase = msg.value != 0;
     return withinPeriod && nonZeroPurchase;
   }

   function hasEnded() public constant returns (bool) {
     return block.number > endBlock;
   }

   function finalize()
     public
     isOwner
     afterEnd
   {
     selfdestruct(wallet);
   }
 }