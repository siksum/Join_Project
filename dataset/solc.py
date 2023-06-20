
from solc_select.solc_select import switch_global_version
import join.compile.solc_parse.parser_function as ps
import os
from pathlib import Path
import sys

def get_versions(file):
    content = ps.get_solidity_source(file)
    sign, version = ps.parse_solidity_version(content)
    return sign, version

def select_compile_version(version: str):
    try:
        if (check_installed_version(version)):
            switch_global_version(version, True)
        else:
            ps.install_solc(version)
            switch_global_version(version, True)
    except:
        print('Failed to switch compile versions')


def check_installed_version(version):
    if "VIRTUAL_ENV" in os.environ:
        HOME_DIR = Path(os.environ["VIRTUAL_ENV"])
    else:
        HOME_DIR = Path.home()
    SOLC_SELECT_DIR = HOME_DIR.joinpath(".solc-select")
    ARTIFACTS_DIR = SOLC_SELECT_DIR.joinpath("artifacts")

    for _, _, files in os.walk(ARTIFACTS_DIR):
        for file in files:
            installed_version = file.split('-')[1]
            if (installed_version == version):
                return True
    return False

def parse(file_path):
    sign, version = get_versions(file_path)
    version_list = ps.get_version_list()

    if len(version) != 1:
        sign, version = ps.compare_version(sign, version)
    sign = sign[0]
    version = version[0]

    index = ps.find_matching_index(version, version_list)

    if sign == '<':
        version = version_list[index - 1]
    elif sign == '>':
        version = version_list[index + 1]
    elif (sign == '^' or sign == '~'):
        version = ps.get_highest_version(version_list, version)
    elif (sign == '=' or sign == '>=' or sign == '<=') or (not sign and version):
        version = version
    else:
        print("incorrect sign")
    return version

def __main__():
    version =parse(sys.argv[1])
    select_compile_version(version)

if __name__ == "__main__":
    __main__()