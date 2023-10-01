import * as React from "react";
import {useState, useRef, useEffect} from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import * as echarts from 'echarts';
import {Box} from "@mui/system";
import {
    ButtonGroup,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import {TypeAnimation} from "react-type-animation";
import "./index.css";

const colors = {
    background: "#434654",
    sidebar: "#202123",
    primary: "#f37321",
    secondary: "#f89b6c",
};

function Detect() {
    // reload, 페이지 이동 시 상태 초기화
    // useState -> 상태관리 : 변수, set* -> 변수값 변경
    const [output, setOutput] = useState();
    const [mitigationResult, setMitigationResult] = useState();

    const [preDetoectorResult, setPreDetoectorResult] = useState([]);
    const [preMitigationResult, setPreMitigationResult] = useState([]);

    const [detector, setDetector] = useState([]);
    const [gpt, setGpt] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const handleGetSlitherResult = async () => {
        console.log("handleGetSlitherResult");
        console.log(detector);

        /* todo EXECUTE 클릭 시 동작
        *   * 값은 콘솔에 전부 찍어놨습니다.
        * */
        // const data = await axios.post("http://localhost:3001/detector", {
        //     rule: detector,
        // });
        // setOutput({type: "detector", data: data.data});
    };

    const handleGetMitigationResult = async () => {
        const data = await axios.get("http://localhost:3001/mitigation");
        setMitigationResult(data);
    };

    const handleFormGPT = (event) => {
        event.preventDefault(); // do not refresh
        setGpt(event.target.value);
    };

    const handleGPT = async (event) => {
        setIsLoading(true);
        event.preventDefault();

        /* submit 클릭했을 때 동작 */
        // const data = await axios.post(
        //     "http://localhost:3001/gpt",
        //     JSON.stringify({text: gpt}), // {name:value} -> "{name:value}"
        //     {
        //         headers: {
        //             "Content-Type": `application/json`,
        //         },
        //     }
        // );
        // setOutput({type: "gpt", data: data.data});
        setGpt("");
        setIsLoading(false);
    };

    /* 카테고리 수정에 사용 */
    const [category, setCategory] = useState('');
    const [middleCategory, setMiddleCategory] = useState([]);

    const handleCategoryChange = (e) => {
        if (e.target.value === "ALL") {
            setDetector(e.target.value);
        } else {
            setDetector([]);
        }
        setCategory(e.target.value);
    };

    const handleLogicChange = (e) => {
        console.log("handleLogicChange");
        console.table(e.target);
        setDetector(e.target.value);
    };

    const handleMiddleChange = (e) => {
        console.log("handleMiddleChange");
        console.table(e.target.value);
        setDetector([]);
        setMiddleCategory(e.target.value);
    };


    return (
        <>
            <Box
                sx={{
                    height: "80%",
                    width: "100%",
                    paddingX: "20px",
                    paddingY: "40px",
                    boxSizing: "border-box",
                }}
            >
                <Box sx={{display: "flex", flexDirection: "column"}}>

                    {/* 메인 카테고리 */}
                    <FormControl fullWidth>
                        <InputLabel id="main_category_label" sx={{backgroundColor: colors.background, paddingX: 2}}>Main
                            Category</InputLabel>
                        <Select
                            sx={{marginBottom: "20px"}}
                            value={category}
                            labelId="main_category_label"
                            id="main_category"
                            onChange={handleCategoryChange}
                        >
                            <MenuItem key={1} value="Vuln">Vuln</MenuItem>
                            <MenuItem key={2} value="Logic">Logic</MenuItem>
                            <MenuItem key={3} value="ALL">ALL</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Logic 카테고리 */}
                    {(category === 'Logic') && (
                        <FormControl fullWidth>
                            <InputLabel id="logic_category_label"
                                        sx={{backgroundColor: colors.background, paddingX: 2}}>
                                Logic Category</InputLabel>
                            <Select
                                sx={{marginBottom: "20px"}}
                                value={detector}
                                labelId="logic_category_label"
                                id="logic_category"
                                onChange={handleLogicChange}
                            >
                                <MenuItem key={3} value="UniSwap">UniSwap</MenuItem>
                                <MenuItem key={4} value="Balancer">Balancer</MenuItem>
                            </Select>
                        </FormControl>
                    )}

                    {/* Vuln 카테고리 */}
                    {(category === 'Vuln') && (
                        <FormControl fullWidth>
                            <InputLabel id="middle_category_label"
                                        sx={{backgroundColor: colors.background, paddingX: 2}}>Middle
                                Category</InputLabel>
                            <Select
                                sx={{marginBottom: "20px"}}
                                value={middleCategory}
                                labelId="middle_category_label"
                                id="middle_category"
                                onChange={handleMiddleChange}
                            >
                                <MenuItem value="Category">Category</MenuItem>
                                <MenuItem value="Specific">Specific</MenuItem>
                            </Select>
                        </FormControl>
                    )}

                    {/* Vuln 하위 카테고리 */}
                    {(middleCategory === 'Category') && (
                        <SelectCategories detector={detector} setDetector={setDetector}/>
                    )}

                    {(middleCategory === 'Specific') && (
                        <SelectDetectors detector={detector} setDetector={setDetector}/>
                    )}

                    <Button sx={{width: "200px", margin: "30px auto 0"}} variant="outlined"
                            onClick={handleGetSlitherResult}>Execute</Button>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        marginTop: "20px",
                    }}
                >

                    {output && output.data && (
                        <ChartContainer chart={""}/>
                    )}

                    {/* Slither 결과 */}
                    <Box
                        sx={{
                            height: "50vh",
                            width: "100%",
                            marginBottom: "40px",
                        }}
                    >
                        <Typography>Result</Typography>
                        <OutputBox>
                            {preDetoectorResult?.map((item, index) => (
                                <Box key={index}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: "12px",
                                        }}
                                    >
                                        {
                                            item.type === "detector"
                                                ? (<img src="/hanwha.svg" width={40} height={40} alt="hanwha"/>)
                                                : (<img src="/gpt.svg" width={40} height={40} alt="gpt"/>)
                                        }
                                        <Box>
                                            <div style={{whiteSpace: "pre-wrap",}}>{item.data}</div>
                                        </Box>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "end",
                                            marginTop: "18px",
                                        }}
                                    >
                                        {item.type === "detector" && (
                                            <ButtonGroup>
                                                <Button onClick={handleGetMitigationResult}>Mitigation</Button>
                                                <Button>Description</Button>
                                            </ButtonGroup>
                                        )}
                                    </Box>
                                </Box>
                            ))}

                            {output && output.data && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: "12px",
                                        alignItems: "self-start",
                                    }}
                                >
                                    {
                                        output.type === "detector"
                                            ? (<img src="/hanwha.svg" width={40} height={40} alt="hanwha"/>)
                                            : (<img src="/gpt.svg" width={40} height={40} alt="gpt"/>)
                                    }
                                    <Box>
                                        <NewDataTypo
                                            data={output.data}
                                            callback={() => {
                                                setPreDetoectorResult([...preDetoectorResult, output]);
                                                setOutput(undefined);
                                            }}
                                        />
                                    </Box>
                                </Box>
                            )}
                        </OutputBox>
                        {/* GPT */}
                    </Box>

                    {/*  */}

                    {/* Slither Description */}
                    {mitigationResult && mitigationResult.data && (
                        <Box sx={{height: "50vh", width: "100%",}}>
                            <Typography>Mitigation & Description</Typography>
                            <OutputBox>
                                {preMitigationResult?.map((item, index) => (
                                    <Box
                                        key={index}
                                        sx={{display: "flex", gap: "12px",}}
                                    >
                                        <img src="/hanwha.svg" width={40} height={40} alt="avatar"/>
                                        <Box><span>{item}</span></Box>
                                    </Box>
                                ))}

                                <Box sx={{display: "flex", gap: "12px",}}>
                                    <img src="/hanwha.svg" width={40} height={40} alt="avatar"/>
                                    <Box>
                                        <NewDataTypo
                                            data={mitigationResult.data}
                                            callback={() => {
                                                setPreMitigationResult([
                                                    ...preMitigationResult,
                                                    mitigationResult.data,
                                                ]);
                                                setMitigationResult(undefined);
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </OutputBox>
                        </Box>
                    )}
                    {/*  */}
                </Box>
                <Box as="form" sx={{marginTop: "60px"}}>
                    <Box
                        sx={{
                            display: "flex",
                            gap: "18px",
                            position: "relative",
                            marginTop: "12px",
                        }}
                    >
                        <TextField
                            variant="outlined"
                            type="text"
                            id="gpt"
                            name="gpt"
                            value={gpt}
                            sx={{flex: 1}}
                            onChange={handleFormGPT}
                        />
                        <Button
                            type="submit"
                            variant="outlined"
                            sx={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                translate: "0 -50%",
                                color: "black",
                            }}
                            onClick={handleGPT}
                        >
                            {
                                isLoading
                                    ? (<p style={{color: "white",}}>Loading..</p>)
                                    : (<p style={{color: "white",}}>Submit</p>)
                            }
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

function NewDataTypo({data, callback}) {
    return (
        <TypeAnimation
            omitDeletionAnimation={true}
            style={{
                whiteSpace: "pre-line",
                display: "block",
            }}
            speed={80}
            sequence={[`${data}`, 500, callback]}
        />
    );
}

function OutputBox({children}) {
    return (
        <Box
            sx={{
                marginTop: "8px",
                height: "100%",
                width: "100%",
                backgroundColor: colors.sidebar,
                border: `1px solid ${colors.primary}`,
                borderRadius: "20px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
                gap: "20px",
                wordBreak: "break-word",
            }}
        >
            {children}
        </Box>
    );
}

function CodeBox({code}) {
    <Box
        sx={{
            backgroundColor: "#f1f1f1",
            borderRadius: "4px",
            padding: "10px",
            fontFamily: "monospace",
        }}
    >
        {code}
    </Box>;
}

function SelectDetectors({detector, setDetector, middleCategory}) {
    const onChange = (event) => {
        setDetector(event.target.value);
    };

    let detectors = [
        "ConstantPragma",
        "IncorrectSolc",
        "LockedEther",
        "ConstantFunctionsAsm",
        "ConstantFunctionsState",
        "MissingInheritance",
        "StorageSignedIntegerArray",
        "UninitializedFunctionPtrsConstructor",
        "ABIEncoderV2Array",
        "ArrayByReference",
        "EnumConversion",
        "MultipleConstructorSchemes",
        "PublicMappingNested",
        "ReusedBaseConstructor",
        "IncorrectERC20InterfaceDetection",
        "ArbitrarySendErc20NoPermit",
        "ArbitrarySendErc20Permit",
        "IncorrectERC721InterfaceDetection",
        "UnindexedERC20EventParameters",
        "ArbitrarySendEth",
        "Suicidal",
        "ExternalFunction",
        "UnimplementedFunctionDetection",
        "ProtectedVariables",
        "DomainSeparatorCollision",
        "Codex",
        "CyclomaticComplexity",
        "ModifierDefaultDetection",
        "DeadCode",
        "NamingConvention",
        "LowLevelCalls",
        "UnusedReturnValues",
        "UncheckedTransfer",
        "UncheckedLowLevel",
        "UncheckedSend",
        "VoidConstructor",
        "Timestamp",
        "BadPRNG",
        "EncodePackedCollision",
        "MissingEventsAccessControl",
        "MissingEventsArithmetic",
        "MissingZeroAddressValidation",
        "ReentrancyBenign",
        "ReentrancyReadBeforeWritten",
        "ReentrancyEth",
        "ReentrancyNoGas",
        "ReentrancyEvent",
        "TokenReentrancy",
        "ShadowingAbstractDetection",
        "StateShadowing",
        "LocalShadowing",
        "BuiltinSymbolShadowing",
        "NameReused",
        "RightToLeftOverride",
        "TxOrigin",
        "Assembly",
        "ControlledDelegateCall",
        "MultipleCallsInLoop",
        "IncorrectStrictEquality",
        "DeprecatedStandards",
        "TooManyDigits",
        "TypeBasedTautology",
        "BooleanEquality",
        "BooleanConstantMisuse",
        "DivideBeforeMultiply",
        "UnprotectedUpgradeable",
        "MappingDeletionDetection",
        "ArrayLengthAssignment",
        "RedundantStatements",
        "CostlyOperationsInLoop",
        "AssertStateChange",
        "IncorrectUnaryExpressionDetection",
        "WriteAfterWrite",
        "MsgValueInLoop",
        "DelegatecallInLoop",
        "UninitializedStateVarsDetection",
        "UninitializedStorageVars",
        "UninitializedLocalVars",
        "VarReadUsingThis",
        "UnusedStateVars",
        "CouldBeConstant",
        "CouldBeImmutable",
        "SimilarVarsDetection",
        "FunctionInitializedState",
        "PredeclarationUsageLocal",
        "SuicidalModule",
        "ReentrancyEth",
    ];

    if (middleCategory === "Default") {
        console.log("middleCategory: " + middleCategory);
        detectors = ["all"];
    }

    return (
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label"
                        sx={{backgroundColor: colors.background, paddingX: 2}}>Detectors</InputLabel>
            <Select
                multiple
                value={detector}
                label="Select Ragister"
                onChange={onChange}
            >
                {detectors.map((item, index) => (
                    <MenuItem key={index} value={item}>
                        {item}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

function SelectCategories({detector, setDetector}) {
    const onChange = (event) => {
        setDetector(event.target.value);
    };

    /* todo 카테고리 목록 변경 */
    const detectors = [
        "Category 1",
        "Category 2",
        "Category 3",
        "Category 4",
        "Category 5",
        "Category 6",
        "Category 7",
        "Category 8",
        "Category 9",
        "Category 10",
        "Category 11",
    ];

    return (
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label"
                        sx={{backgroundColor: colors.background, paddingX: 2}}>Detectors</InputLabel>
            <Select
                multiple
                value={detector}
                label="Select Ragister"
                onChange={onChange}
            >
                {detectors.map((item, index) => (
                    <MenuItem key={index} value={item}>
                        {item}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

function ChartContainer(data) {
    const chartContainerRef = useRef(null);
    const myChartRef = useRef(null);

    const arrChart = data.chart || [
        {value: 1048, name: 'Search Engine'},
        {value: 735, name: 'Direct'},
        {value: 580, name: 'Email'},
        {value: 484, name: 'Union Ads'},
        {value: 300, name: 'Video Ads'},
    ]

    useEffect(() => {
        // 차트 컨테이너와 차트 인스턴스를 가져옴
        const chartContainer = chartContainerRef.current;
        const myChart = echarts.init(chartContainer);

        // 차트 옵션
        const option = {
            title: {
                text: 'Referer of a Website',
                subtext: '제목 입력',
                left: 'center',
            },
            tooltip: {
                trigger: 'item',
            },
            /*legend: {
                orient: 'vertical',
                left: 'left',
            },*/
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data: arrChart,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    },
                },
            ],
        };

        // 차트 옵션을 설정하고 그림
        myChart.setOption(option);

        // 차트 인스턴스를 참조에 저장
        myChartRef.current = myChart;

        // 창 크기가 변경될 때 차트 크기도 조정
        const handleResize = () => {
            myChart.resize();
        };
        window.addEventListener('resize', handleResize);

        // 컴포넌트 언마운트 시 이벤트 핸들러 제거
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <div ref={chartContainerRef} style={{width: '100%', height: '400px'}}/>;
}


export default Detect;
