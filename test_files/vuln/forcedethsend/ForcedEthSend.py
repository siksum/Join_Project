"""
Module detecting usage of `tx.origin` in a conditional node
"""
from typing import List, Tuple, Optional
import re

from slither_core.core.cfg.node import Node
from slither_core.core.declarations.contract import Contract
from slither_core.core.declarations.function_contract import FunctionContract
from slither_core.detectors.abstract_detector import (
    AbstractDetector,
    DetectorClassification,
    DETECTOR_INFO,
)
from slither_core.slithir.operations.type_conversion import TypeConversion

from slither_core.utils.output import Output



class ForcedETHSend(AbstractDetector):
    """
    Detect usage of address(this).balance in a conditional node
    """

    ARGUMENT = "address-this-balance"
    HELP = "Dangerous usage of `address(this).balance`"
    IMPACT = DetectorClassification.MEDIUM
    CONFIDENCE = DetectorClassification.MEDIUM

    WIKI = (
        "https://github.com/crytic/slither/wiki/Detector-Documentation#dangerous-usage-of-txorigin"
    )

    WIKI_TITLE = "Dangerous usage of `address(this).balance`"
    WIKI_DESCRIPTION = "`address(this).balance`-Selfdestruct function forces the remaining Ether to the specified address and destroys the contract"

    # region wiki_exploit_scenario
    WIKI_EXPLOIT_SCENARIO = """
```solidity
contract Attack {
    EtherGame etherGame;

    constructor(EtherGame _etherGame) {
        etherGame = EtherGame(_etherGame);
    }

    function attack() public payable {
        // You can simply break the game by sending ether so that
        // the game balance >= 7 ether

        // cast address to payable
        address payable addr = payable(address(etherGame));
        selfdestruct(addr);
    }
}
```
1. Deploy EtherGame
2. Players (say Alice and Bob) decides to play, deposits 1 Ether each.
2. Deploy Attack with address of EtherGame
3. Call Attack.attack sending 5 ether. This will break the game
    No one can become the winner."""
    # endregion wiki_exploit_scenario

    WIKI_RECOMMENDATION = "Do not use `address(this).balance` for authorization."

    def check_visibility(self, function: FunctionContract) -> bool:
        if function.visibility in ["public", "external"]:
            return True
        
    def check_address_this_balance_in_variable(self, function: FunctionContract) -> bool:
        for node in function.nodes:
            for ir in node.irs:
                if isinstance(ir, TypeConversion):      
                    if "address(this).balance" in str(ir.node.expression):
                        for written in node._local_vars_written:
                            if str(written.name) in str(ir.node.expression):
                                return written.name
                                n = [n for n in condtional_nodes if str(written.name) in str(n)]
                                if n :
                                    return True
                                else:
                                    return False
                    else: 
                        return False
                else: 
                    return False
        return False


    @staticmethod
    def _contains_incorrect_address_this_balance_use(self, written: List[Optional[str]], node: Node) -> bool:
        incorrect_node = [n for n in node if written in str(n) or "address(this).balance" in str(n)]
        if incorrect_node:
            return True
        return False
        

    def detect_tx_origin(self, function: FunctionContract) -> List[Tuple[FunctionContract, List[Node]]]:
        ret = []

        for f in function:
            nodes = function.nodes
            
            condtional_nodes = [
                n for n in nodes if n.contains_if() or n.contains_require_or_assert()
            ]

            written_name = [str(n) for n in f if self.check_address_this_balance_in_variable(n)]

            bad_tx_nodes = [
                n for n in condtional_nodes if self._contains_incorrect_address_this_balance_use(written_name, n)
            ]

            if bad_tx_nodes:
                ret.append((f, bad_tx_nodes))
    
        return ret

    
    def detect(self, contract: Contract) -> List[FunctionContract]:
        for f in contract.functions_declared:
            if self.check_visibility(f):
                result = self.detect_tx_origin(f)
        return result


    def _detect(self) -> List[Output]:
        """Detect the functions that use tx.origin in a conditional node"""
        results = []
        for c in self.contracts:
            values = self.detect_address_this_balance(c)
            for func, nodes in values:
                for node in nodes:
                    info: DETECTOR_INFO = [
                        func, " uses tx.origin for authorization: ", node, "\n"]
                    res = self.generate_result(info)
                    results.append(res)

        return results
