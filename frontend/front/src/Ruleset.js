import * as React from "react";
import {useState, useRef} from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import {Box} from "@mui/system";
import {
    ButtonGroup,
    FormControl,
    MenuItem,
    Select,
    InputLabel,
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

function Ruleset() {
    // reload, 페이지 이동 시 상태 초기화
    // useState -> 상태관리 : 변수, set* -> 변수값 변경
    const [output, setOutput] = useState();
    const [mitigationResult, setMitigationResult] = useState();

    const [preDetoectorResult, setPreDetoectorResult] = useState([]);

    const [gpt, setGpt] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const rulesetRef = useRef();

    const handleGetMitigationResult = async () => {
        const data = await axios.get("http://localhost:3001/mitigation");
        setMitigationResult(data);
    };

    const handleFormGPT = (event) => {
        event.preventDefault(); // do not refresh
        setGpt(event.target.value);
    };

    /* 룰 입력 시 값 동기화 */
    const handleInputChange = (e) => {
        console.log(e.target.value);
        setGpt(e.target.value);
    }

    /* ADD 를 클릭했을 때 동작 */
    const handleRuleSet = async (e) => {
        console.log("handleGPT");
        console.log(e.target.textContent);
        if (isLoading === true) {
            return;
        }
        const value = gpt;
        console.log(value);
        setIsLoading(true);

        if (e.target.textContent === "ADD") {
            /* todo ADD 클릭했을 때 동작 */

            /* axios 로 연결 */
            // const data = await axios.post(
            //     "http://localhost:3001/gpt",
            //     JSON.stringify({text: gpt}), // {name:value} -> "{name:value}"
            //     {
            //         headers: {
            //             "Content-Type": `application/json`,
            //         },
            //     }
            // );
        } else if (e.target.textContent === "REMOVE") {
            /* todo REMOVE 클릭했을 때 동작 */

            /* axios 로 연결 */
            // const data = await axios.post(
            //     "http://localhost:3001/gpt",
            //     JSON.stringify({text: gpt}), // {name:value} -> "{name:value}"
            //     {
            //         headers: {
            //             "Content-Type": `application/json`,
            //         },
            //     }
            // );
        }
        /* 결과 적용 */
        // setOutput({type: "gpt", data: data.data});
        // setGpt("");
        setIsLoading(false);
    };

    return (
        <>
            <Box
                sx={{
                    position: "relative",
                    height: "80%",
                    width: "100%",
                    paddingX: "20px",
                    boxSizing: "border-box",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                    }}
                >
                    {/* Slither 결과 */}
                    <Box
                        sx={{
                            width: "100%",
                            marginBottom: "40px",
                        }}
                    >

                        <Box sx={{marginTop: "60px"}}>
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: "18px",
                                    position: "relative",
                                    marginTop: "12px",
                                    marginBottom: "40px",
                                }}
                            >
                                <TextField
                                    variant="outlined"
                                    type="text"
                                    id="ruleset"
                                    name="ruleset"
                                    ref={rulesetRef}
                                    placeholder={"Input Rules"}
                                    value={gpt}
                                    sx={{flex: 1}}
                                    onChange={handleInputChange}
                                />
                                <Button
                                    variant="outlined"
                                    onClick={handleRuleSet}
                                >
                                    {
                                        isLoading
                                            ? (<p style={{color: "white",}}>Loading..</p>)
                                            : (<p style={{color: "white",}}>ADD</p>)
                                    }
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={handleRuleSet}
                                >
                                    {
                                        isLoading
                                            ? (<p style={{color: "white",}}>Loading..</p>)
                                            : (<p style={{color: "white",}}>Remove</p>)
                                    }
                                </Button>

                            </Box>
                        </Box>
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
                    <Box as="form">
                        <Box
                            sx={{
                                display: "flex",
                                gap: "18px",
                                position: "relative",
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
                minHeight: "50vh",
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

export default Ruleset;
