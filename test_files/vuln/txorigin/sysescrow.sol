pragma solidity ^0.4.18;

contract SysEscrow {
    address public owner;
    address arbitrator;

    uint public MinDeposit = 600000000000000000; // 0.6 Ether

    uint constant ARBITRATOR_PERCENT = 1; //1%

    struct Escrow {
            bool exists;        
        
            address seller;
            address buyer;
            uint summ;
            uint buyerCanCancelAfter;
            bool buyerApprovedTheTransaction;
            bool arbitratorStopTransaction;
    }

    mapping (bytes32 => Escrow) public escrows;

    modifier onlyOwner() {
        require(tx.origin == owner);
        _;
    }

    function SysEscrow() {
        owner = msg.sender;
        arbitrator = msg.sender;
    }

function createEscrow(
      bytes16 _tradeID, // The unique ID of the trade
      address _seller, // The selling party of the trade
      address _buyer, // The buying party of the trade

      uint _paymentWindowInSeconds
    ) payable external {
        uint256 _value = msg.value;
        require(_value>=MinDeposit);
        bytes32 _tradeHash = keccak256(_tradeID, _seller, _buyer, _value);
        require(!escrows[_tradeHash].exists); // Require that trade does not already exist
        uint _buyerCanCancelAfter =  now + _paymentWindowInSeconds;
        escrows[_tradeHash] = Escrow(true, _seller, _buyer, _value, _buyerCanCancelAfter, false, false);

    }    

    function setArbitrator( address _newArbitrator ) onlyOwner {

        arbitrator = _newArbitrator;
    }

    function setOwner(address _newOwner) onlyOwner external {
        owner = _newOwner;
    }

    function cancelEscrow(
      bytes16 _tradeID, // The unique ID of the trade
      address _seller, // The selling party of the trade
      address _buyer, // The buying party of the trade
      uint256 _value // 
    )  external {
        
        bytes32 _tradeHash = keccak256(_tradeID, _seller, _buyer, _value);
        require(escrows[_tradeHash].exists);
        require(escrows[_tradeHash].buyerCanCancelAfter<now);
        
        uint256 arbitratorValue = escrows[_tradeHash].summ*ARBITRATOR_PERCENT/100;
        uint256 buyerValue =  escrows[_tradeHash].summ - arbitratorValue;
        
        bool buyerReceivedMoney = escrows[_tradeHash].buyer.call.value(buyerValue)();
        bool arbitratorReceivedMoney = arbitrator.call.value(arbitratorValue)();
        
        if ( buyerReceivedMoney && arbitratorReceivedMoney )
        {    
            delete escrows[_tradeHash];
        } else {
            throw;
        }
    }
    
    function approveEscrow(
      bytes16 _tradeID, // The unique ID of the trade
      address _seller, // The selling party of the trade
      address _buyer, // The buying party of the trade
      uint256 _value // Trade value
    )  external {
        bytes32 _tradeHash = keccak256(_tradeID, _seller, _buyer, _value);
        require(escrows[_tradeHash].exists);
        require(escrows[_tradeHash].buyer==msg.sender);
        escrows[_tradeHash].buyerApprovedTheTransaction = true;
    }
    
    function releaseEscrow(
      bytes16 _tradeID, // The unique ID of the trade
      address _seller, // The selling party of the trade
      address _buyer, // The buying party of the trade
      uint256 _value // Trade value
    )  external {
        
        bytes32 _tradeHash = keccak256(_tradeID, _seller, _buyer, _value);
        require(escrows[_tradeHash].exists);
        require(escrows[_tradeHash].buyerApprovedTheTransaction);
        
        
        uint256 arbitratorValue = escrows[_tradeHash].summ*ARBITRATOR_PERCENT/100;
        uint256 buyerValue =  escrows[_tradeHash].summ - arbitratorValue;
        
        bool sellerReceivedMoney = escrows[_tradeHash].seller.call.value(buyerValue)();
        bool arbitratorReceivedMoney = arbitrator.call.value(arbitratorValue)();
        
        if ( sellerReceivedMoney && arbitratorReceivedMoney )
        {    
            delete escrows[_tradeHash];
        } else {
            throw;
        }
    }
    
    function isExistsEscrow(
      bytes16 _tradeID, // The unique ID of the trade
      address _seller, // The selling party of the trade
      address _buyer, // The buying party of the trade
      uint256 _value // Trade value
    )  constant returns (bool es)  { 
        bytes32 _tradeHash = keccak256(_tradeID, _seller, _buyer, _value);
        return escrows[_tradeHash].exists;    
    }
}