# Requirements

### Install the required packages before using `dream` :

```bash
$ pipe install termcolor
$ pip3 install colored
$ pip3 install tabulate
$ pip3 install crytic-compile
$ pip3 install solc-select
$ pip3 install setuptools
$ pip3 install numpy
$ pip3 install https://github.com/facebookresearch/fastText/archive/0.2.0.zip --user
```

### Installation of a pretrained model for Code Similarity Check :

해당 파일은 모든 함수를 벡터로 변환하는 과정에서 사용되며, code-similar의 train 기능을 사용하여 직접 학습시킨 모델을 사용하거나 우리의 사전 학습된 모델([etherscan_verified_contract.bin](https://drive.google.com/u/0/uc?id=1oEhbIL4V9582Y5VKp4iiOURGq8qa4cBN&export=download, "link"))을 사용할 수 있다.
`etherscan_verified_contract.bin` 파일은 `/join/simil` 디렉토리에 에 위치하도록 해야 한다.

<br></br>

# Setup

### 설치 후 사용

```bash
pip3 setup.py install
```

### 기능 수정하고자 할 때(setup.py가 위치한 곳에서)

```bash
pip3 -e install .
```

<br></br>

# Usage

## 1. Version

```bash
$ dream --version

Current version: ('0.6.6', PosixPath('/Users/join/.solc-select/global-version'))

Installed versions: ['0.4.22', '0.4.24', '0.5.0', '0.5.12', '0.5.16', '0.6.0', '0.6.6', '0.7.0', '0.7.6', '0.8.0', '0.8.1', '0.8.13', '0.8.19', '0.8.20']
```

- Current version : Currently used solc-version
- Installed versions : List of installed solc-version list

---

## 2. Rule-Setting

[Rule-set Wiki](https://github.com/Namryeong-Kim/Join_Project_v2/wiki/Adding-Removing-a-new-detector)

### Adding a new detector

```bash
$ dream ruleset add [New_Rule.py]
```

### Removing a detector

```bash
$ dream ruleset remove [Rule Name]
```

---

## 3. Detector

[Detector Wiki](https://github.com/Namryeong-Kim/Join_Project_v2/wiki/Detector-Documentation)

### Vulnerability(vuln)

vuln은 취약점 탐지를 위한 기능으로, 특정 detector를 지정하여 실행할 수도 있다.

```bash
$ dream detect vuln [target.sol]
```

```bash
$ dream detect vuln [target.sol] [detector]
```

### Business Logic(logic)

logic은 비즈니스 로직을 만족하고 있는지 확인하기 위한 기능이다.

```bash
$ dream detect logic [type] [target.sol] [contract name]
```

### All

all은 취약점 탐지와 비즈니스 로직 탐지를 모두 수행하기 위한 기능이다.

```bash
$ dream detect all [type] [target.sol] [contract name]
```

---

## 4. Code-Similarity

[Code-Similarity Wiki](https://github.com/Namryeong-Kim/Join_Project_v2/wiki/Code-Similarity-Documentation)

### train

train은 새로운 모델 학습을 위한 기능이다.

```bash
$ dream code-similar train [model.bin] [dataset_dir]
```

### test

test는 유사성 테스트를 수행하기 위한 기능이다.

```bash
$ dream code-similar test [target.sol] [contract.function] [detector_dir] [bin file]
```
