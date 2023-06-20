from join.compile.compile import Join
from slither_core.slithir.operations.type_conversion import TypeConversion

dream = Join('./ethergame.sol')

for compilation_unit in dream.compilation_units.values():
    results = []
    for contract in compilation_unit.contracts:
        for function in contract.functions:
            if function.visibility in ["public", "external"]:
                condtional_nodes = [
                    n for n in function.nodes if (n.contains_if() or n.contains_require_or_assert())
                ]
                for node in function.nodes:
                    for ir in node.irs:
                        if isinstance(ir, TypeConversion):      
                            if "address(this).balance" in str(ir.node.expression):
                                for written in node._local_vars_written:
                                    print(type(written))
                                    if str(written.name) in str(ir.node.expression):
                                        n = [n for n in condtional_nodes if str(written.name) in str(n)]
                                        if n :
                                            results.append((function.name, True))
                                        else:
                                            False
                if condtional_nodes:
                    for node in condtional_nodes:
                        if "address(this).balance" in str(node):
                            results.append((function.name, True))
                else:
                    False

print(results)