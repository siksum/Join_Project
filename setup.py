# setup.py
from setuptools import find_packages, setup

setup(
    name='dream-analyzer',
    version='0.1.0',
    packages=find_packages(),
    include_package_data=True,
    python_requires='>=3.8',
    install_requires=[
        'solc-select==1.0.3',

    ],
    entry_points={
        'console_scripts': ['dream=join.__main__:main', 'dream-flat=join.run_flat.__main__:main'],
    },
)
