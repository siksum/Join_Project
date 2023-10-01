const express = require("express");
var cors = require("cors");
const app = express();
const child_process = require("child_process");
const bodyParser = require("body-parser");
require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

/**
 * use : middleware front -> middleware -> server
 */
app.use(bodyParser.json());
app.use(cors());

/**
 * req : front -> server
 * res : server -> front
 */
app.post("/detector", async function (req, res) {
  const result = await child_process.spawn("sikk", [
    "detect",
    "vuln",
    ...req.body.rule,
    "reentrancy.sol",
  ]);
  result.stdout.on("data", function (data) {
    //data 받았을때 callback으로 실행 (비동기이기 때문)
    const sendResult = data.toString();
    res.send(sendResult);
  });
  result.stderr.on("data", function (data) {
    console.error(data.toString());
  }); // 실행 >에러
});

app.get("/mitigation", async function (req, res) {
  res.send(
    "MItigationMItigationMItigationMItigationMItigationMItigationMItigationMItigationMItigation"
  );
});

app.post("/gpt", async function (req, res) {
  let result = "";
  const { text } = req.body; // const text = req.body.text;
  if (req.body === "undefined" || req.body.text === "" || req.body === {}) {
    res.send("Not Supported");
  }
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: text ?? "",
      temperature: 0,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    console.log(response);
    result = response.data.choices[0].text.trim();
  } catch (error) {
    console.log(error);
  }

  res.send(result);
});

app.listen(3001, () => console.log("3001 포트 대기"));
