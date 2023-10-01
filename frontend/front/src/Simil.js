import * as React from "react";
import {useState} from "react";
import Button from "@mui/material/Button";
import axios from "axios";
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
import {ThemeProvider} from "@emotion/react";

const colors = {
    background: "#434654",
    sidebar: "#202123",
    primary: "#f37321",
    secondary: "#f89b6c",
};

function Simil() {
    // reload, 페이지 이동 시 상태 초기화
    // useState -> 상태관리 : 변수, set* -> 변수값 변경
    const [output, setOutput] = useState();
    const [mitigationResult, setMitigationResult] = useState();

    const [preDetoectorResult, setPreDetoectorResult] = useState([]);
    const [preMitigationResult, setPreMitigationResult] = useState([]);

    const [detector, setDetector] = useState(["Reentrancy"]);
    const [gpt, setGpt] = useState('');
    const [similValue, setSimilValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const handleGetMitigationResult = async () => {
        const data = await axios.get("http://localhost:3001/mitigation");
        setMitigationResult(data);
    };

    const handleFormGPT = (event) => {
        event.preventDefault(); // do not refresh
        setGpt(event.target.value);
    };

    const handleSimilValue = (e) => {
        console.log(e.target.value);
        setSimilValue(e.target.value);
    };
    const [category, setCategory] = useState('');

    /* todo TEST 또는 TRAIN 의 SUBMIT 버튼 클릭 시 동작 */
    const handleSimilSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();

        const type = category; // TEST / TRAIN의 값이 전달됩니다.
        const arrText = similValue.split(',').map(item => item.trim()); // 배열의 형태로 값 전달
        console.log("type: "+ type);
        console.table(arrText);

        // const data = await axios.post(
        //     "http://localhost:3001/gpt",
        //     JSON.stringify({type: type, text: arrText}), // {name:value} -> "{name:value}"
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


    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
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
                {/* 메인 카테고리 */}
                <FormControl fullWidth>
                    <InputLabel
                        id="main_category_label"
                        sx={{backgroundColor: colors.background, paddingX: 2}}
                    >Simil Category</InputLabel>
                    <Select
                        sx={{marginBottom: "20px"}}
                        value={category}
                        labelId="main_category_label"
                        id="main_category"
                        onChange={handleCategoryChange}
                    >
                        <MenuItem key={1} value="TEST">TEST</MenuItem>
                        <MenuItem key={2} value="TRAIN">TRAIN</MenuItem>
                    </Select>
                </FormControl>

                {(category !== '') && (
                    <Box as="form" sx={{marginY: "20px"}}>
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
                                placeholder={category === "TEST" ? "TEST1" : "TRAIN1"}
                                value={similValue}
                                sx={{flex: 1}}
                                onChange={handleSimilValue}
                            />
                            <Button
                                type="submit"
                                variant="outlined"
                                sx={{
                                    color: "black",
                                }}
                                onClick={handleSimilSubmit}
                            >
                                {
                                    isLoading
                                        ? (<p style={{color: "white",}}>Loading..</p>)
                                        : (<p style={{color: "white",}}>Submit</p>)
                                }
                            </Button>
                        </Box>
                    </Box>
                )}

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        marginTop: "20px",
                    }}
                >
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
                                        {item.type === "detector" ? (
                                            <img
                                                src="/hanwha.svg"
                                                width={40}
                                                height={40}
                                                alt="hanwha"
                                            />
                                        ) : (
                                            <img src="/gpt.svg" width={40} height={40} alt="gpt"/>
                                        )}

                                        <Box>
                                            <div
                                                style={{
                                                    whiteSpace: "pre-wrap",
                                                }}
                                            >
                                                {item.data}
                                            </div>
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
                                                <Button onClick={handleGetMitigationResult}>
                                                    Mitigation
                                                </Button>
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
                                    {output.type === "detector" ? (
                                        <img
                                            src="/hanwha.svg"
                                            width={40}
                                            height={40}
                                            alt="hanwha"
                                        />
                                    ) : (
                                        <img src="/gpt.svg" width={40} height={40} alt="gpt"/>
                                    )}
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
                            // onClick={handleGPT}
                        >
                            {isLoading ? (
                                <p
                                    style={{
                                        color: "white",
                                    }}
                                >
                                    Loading..
                                </p>
                            ) : (
                                <p
                                    style={{
                                        color: "white",
                                    }}
                                >
                                    Submit
                                </p>
                            )}
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

export default Simil;
