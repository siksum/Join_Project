import * as React from "react";
import {useState} from "react";
import Detect from "./Detect";
import Ruleset from "./Ruleset";
import Simil from "./Simil";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import axios from "axios";
import {Box, styled} from "@mui/system";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography,
    createTheme,
} from "@mui/material";

import Tabs from "@mui/base/Tabs";
import TabsList from "@mui/base/TabsList";
import TabPanel from "@mui/base/TabPanel";
import {buttonClasses} from "@mui/base/Button";
import Tab, {tabClasses} from "@mui/base/Tab";

import {TypeAnimation} from "react-type-animation";
import "./index.css";
import {ThemeProvider} from "@emotion/react";

const colors = {
    background: "#434654",
    sidebar: "#202123",
    primary: "#f37321",
    secondary: "#f89b6c",
};

const grey = {
    50: "#f6f8fa",
    100: "#eaeef2",
    200: "#d0d7de",
    300: "#afb8c1",
    400: "#8c959f",
    500: "#6e7781",
    600: "#57606a",
    700: "#424a53",
    800: "#32383f",
    900: "#24292f",
};

const StyledTab = styled(Tab)`
  font-family: IBM Plex Sans, sans-serif;
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: bold;
  background-color: transparent;
  width: 100%;
  padding: 12px;
  margin: 6px 6px;
  border: none;
  border-radius: 7px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: #f89b6c;
    color: #202123;
  }

  &.${tabClasses.selected} {
    background-color: #f37321;
    color: #202123;
  }

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledTabPanel = styled(TabPanel)`
  width: 100%;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
`;

const StyledTabsList = styled(TabsList)(
    ({theme}) => `
  min-width: 400px;
  background-color: #434654;
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  box-sizing: border-box;
  box-shadow: 0px 4px 8px ${
        theme.palette.mode === "dark" ? grey[900] : grey[200]
    };
  `
);

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#f37321",
        },
        secondary: {
            main: "#f89b6c",
        },
        sub: {
            main: "#fbb584",
        },
    },
});

function App() {
    return (
        <div className="App">
            {/* Dark Mode in MUI: MUI UI를 다크모드일 때 하얀색으로 변경돼서 다크모드로 변경함 */}
            <ThemeProvider theme={darkTheme}>
                <Box
                    sx={{
                        display: "flex",
                        minHeight: "100vh",
                    }}
                >
                    <Box
                        as="main"
                        sx={{
                            backgroundColor: colors.background,
                            flex: 1,
                            color: "white",
                        }}
                    >
                        {/* header */}
                        <Box
                            as="header"
                            sx={{
                                paddingY: "12px",
                            }}
                        >
                            <Typography
                                variant="h6"
                                align="center"
                                sx={{
                                    textTransform: "uppercase",
                                }}
                            >
                                join v0.1
                            </Typography>
                        </Box>

                        <Tabs defaultValue={1}>
                            <StyledTabsList
                                sx={{
                                    width: "calc(100% - 40px)",
                                    paddingX: "20px",
                                    margin: "0 auto",
                                }}
                            >
                                <StyledTab value={1}>Rule Set</StyledTab>
                                <StyledTab value={2}>Detect</StyledTab>
                                <StyledTab value={3}>Simil</StyledTab>
                            </StyledTabsList>
                            <StyledTabPanel value={1}>
                                <Ruleset/>
                            </StyledTabPanel>
                            <StyledTabPanel value={2}>
                                <Detect/>
                            </StyledTabPanel>
                            <StyledTabPanel value={3}>
                                <Simil/>
                            </StyledTabPanel>
                        </Tabs>
                    </Box>
                </Box>
            </ThemeProvider>
        </div>
    );
}
export default App;
