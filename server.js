const express = require("express");
const path = require("path");
const app = express();
const yaml = require('js-yaml');
const fs = require('fs');
const http = require('http');

// start config.yaml reading here
const fileContents = fs.readFileSync('config.yaml', 'utf8');
const config = yaml.load(fileContents);

const PORT = config.port;
const districtUrl = config.canvasDistrictUrl;
const betterConsole = config.alerts;


async function canvasAPI(token, link) {
  let url = "https://" + districtUrl + link + token; let result;
  console.log(url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    result = await response.json();
  }
  catch (error) {
    console.error(error.message);
  }
  return result;
}

app.get('/rawData', async (req, res) => {
  if (betterConsole) {console.log("Getting raw data..")};
  let arrayThing = req.query;
  console.log
  try {
    if (!arrayThing.token) {throw new Error("crash.");}
    res.send(await canvasAPI(arrayThing.token, "/api/v1/users/self?access_token="));
    if (betterConsole) {console.log("Sent canvas data...");}
  }
  catch (error) {res.send("Not correct way to send data"); console.error(error)};
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});