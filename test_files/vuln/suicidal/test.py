from join.compile.compile import Join
from slither_core.core.cfg.node import Node
import slither_core.slithir.operations as solc_ast
from slither_core.core.declarations.function_contract import FunctionContract


dream = Join('./suicide.sol')


def ownership_check():
    variable_name = ""

    for compilation in dream.compilation_units.values():
        for contract in compilation.contracts:
            for function in contract.functions:
                if function.visibility in ["public", "external"]:
                    calls = [c.name for c in function.internal_calls]
                    if ("suicide(address)" in calls or "selfdestruct(address)" in calls):
                        if function.is_protected():
                            return True
                        else:
                            for node in function.nodes:
                                for ir in node.irs:
                                    if isinstance(ir, solc_ast.Assignment) and str(ir.rvalue) == "msg.sender":
                                        for written in node._local_vars_written:
                                            variable_name = written.name
                                    elif isinstance(ir, solc_ast.Binary):
                                        for variable in ir._variables:
                                            if variable_name is str(variable) and variable_name in str(ir.expression):
                                                print(
                                                    f"msg.sender using in {variable_name}")
                                                return True
                                    else:
                                        return False

                


for compilation in dream.compilation_units.values():
    results = []
    for contract in compilation.contracts:
        for function in contract.functions:
            condtional_nodes = [
                n for n in function.nodes if not (n.contains_if() or n.contains_require_or_assert())
            ]
    if condtional_nodes:
        bad_tx_nodes = ownership_check()
        if bad_tx_nodes is False:
            results.append((function.name, bad_tx_nodes))
            print("not use ownership check")

        else:
            print("use ownership check and correct selfdestruct/suicide")
