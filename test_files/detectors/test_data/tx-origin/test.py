from join.compile.compile import Join

dream= Join('./tx_origin.sol')

for compilation in dream.compilation_units.values():
    for contract in compilation.contracts:
        print("Contract Name: ", contract.name)
        for function in contract.functions:
            print("Function Name: ", function.name)
            print("Function Visibility: ", function.visibility)
            print("Function Modifiers: ", function.modifiers)
            print("Function State Mutability: ", function.state_variables_read)
            print("Function Parameters: ", function.parameters)
            print("Function Return Parameters: ", function.state_variables_written)
            print("Function Expressions: ", function.expressions)
            print("============================================")
            for node in function.nodes:
               for ir in node.irs:
                    print(ir)