from join.compile.compile import Join
import re

dream= Join('./tx.origin.sol')
pattern = r'tx\.origin'
matches=[]

def get_crytic_compile_list():
    for compilation in dream.compilation_units.values():
        for contract in compilation.contracts:
            for function in contract.functions:
                for node in function.nodes:
                    for ir in node.irs:
                        matches.append(re.findall(pattern, ir.node.expression.__str__()))
    return matches
def isTrue(matches):
    for match in matches:
        if match:
            return(True)
        
    return(False)

matches = get_crytic_compile_list()
print(isTrue(matches))
