from join.compile.compile import Join
from slither_core.slithir.operations import Binary

dream = Join('./example.sol')

(_, version) = dream.get_versions('./example.sol')
SAFEMATH_CONST = ["add", "mul", "sub", "div"]
CONST = ["+", "-", "*"]
results = []
print(version)
for compilation_unit in dream.compilation_units.values():
    for contract in compilation_unit.contracts:
        if any("0.8" in ver for ver in version):
            for safemath in contract.all_library_calls or []:
                # print(f"{safemath[0].name}.{safemath[1].name}")
                if safemath[1].name in SAFEMATH_CONST and safemath[0].name == "SafeMath":
                    results.append(
                        {"lib": safemath[0].name, "func": safemath[1].name})
                    # results.append(f"{safemath[0].name}.{safemath[1].name}")
        else:
            for function in contract.functions:
                for node in function.nodes:
                    for operation in node.all_slithir_operations():
                        if isinstance(operation, Binary):
                            result = any(c in CONST for c in str(
                                operation)) or 'unit' in str(operation.lvalue.type)
                            if result is True:
                                results.append(
                                    {"func": function.name, "node": node.__str__(), "ir": operation.__str__()})


print(results)
if any('lib' in r for r in results):
    print("You don't need to use SafeMath")
elif any('func' in r for r in results):
    print("Over/Underflow")
else:
    print("Nah..")
