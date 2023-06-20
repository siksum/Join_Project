from join.compile.compile import Join
from slither_core.slithir.operations.low_level_call import LowLevelCall

dream = Join('./reentrancy.sol')

for compilation in dream.compilation_units.values():
    for contract in compilation.contracts:
        for function in contract.functions_and_modifiers:
            for node in function.nodes:
                for ir in node.irs:
                    print(ir)
                    if isinstance(ir, LowLevelCall):
                        if ir.can_send_eth() and ir.destination and ir.call_value:
                            
                            state_variable =[n for n in node.state_variables_written if str(n) == str(ir.call_value)]
                            print(state_variable)
                            for state in state_variable:
                                print(state)
                        print(type(ir))
                    # print(ir)
                    # print(type(ir))
            # for f in function.internal_calls:
            #     print(f.name)
          
            
            # for f in function._all_low_level_calls:
            #     print(f)

"""
    function withdraw() public {
        uint bal = balances[msg.sender];
        require(bal > 0);

        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send Ether");

        balances[msg.sender] = 0;
    }
"""