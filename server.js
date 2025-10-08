const express = require("express");
const path = require("path");
const app = express();
const yaml = require('js-yaml');
const fs = require('fs');

// start config.yaml reading here
const fileContents = fs.readFileSync('config.yaml', 'utf8');
const config = yaml.load(fileContents);

const PORT = config.port;
const betterConsole = config.alerts;

let LISTENING = config.listen;
if (LISTENING === "local") {LISTENING = '127.0.0.1';}
else if (LISTENING === "all") {LISTENING = '0.0.0.0'} 


async function canvasAPI(token, link, extra) {
  let url = "https://canvas.instructure.com" + link + token + extra; let result;
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
    res.send(await canvasAPI(arrayThing.token, "/api/v1/users/self?access_token=", ""));
    if (betterConsole) {console.log("Sent canvas data...");}
  }
  catch (error) {res.send("Not correct way to send data"); console.error(error)};
});

app.get('/cleanJson', async (req, res) => {
  if (betterConsole) {console.log("Getting JSON cleaned data..")};
  let arrayThing = req.query;
  try { 
    if (!arrayThing.token) {throw new Error("crash.");}
    let data = await canvasAPI(arrayThing.token, "/api/v1/users/self?access_token=", ""); 
    // #region 
    // I copied most of this from my java project and rewrote into JS.
    let id = data.id;
    let name = data.name; 
    let createdDate = data.created_at; 
    let sortableName = data.sortable_name; 
    let shortName = data.short_name;
    let avatarUrl = data.avatar_url;
    let lastName = data.last_name;
    let firstName = data.first_name;
    let effectiveLocale = data.effective_locale;
    let permissions = data.permissions;
    let canUpdateProfilePicture = permissions.can_update_avatar;
    let limitParentWebAccess = permissions.limit_parent_app_web_access;
    let output = (
        "ID: " + id + "<br>" +
        "Name: " + name + "<br>" +
        "Date Created: " + createdDate + "<br>" +
        "Sorted Name: " +sortableName + "<br>" +
        "First Name: " + firstName + "<br>" +
        "Last Name: " + lastName + "<br>" +
        "Short Name: " + shortName + "<br>" +
        "Profile Picture Link: " + avatarUrl + "<br>" +
        "Effective Locale: " + effectiveLocale + "<br>" +
        "Can Update Profile Picture: " + canUpdateProfilePicture + "<br>" +
        "Can Parents Access Web: " + limitParentWebAccess + "<br>"
    ); 
    //#endregion
    
    res.send(output);
    if (betterConsole) {console.log("Sent canvas data...");}
  }
  catch (error) {res.send("Not correct way to send data"); console.error(error)};
});

app.get('/rawClassesData', async (req, res) => {
  if (betterConsole) {console.log("Getting raw classes data..")};
  let arrayThing = req.query;
  console.log
  try {
    if (!arrayThing.token) {throw new Error("crash.");}
    res.send(await canvasAPI(arrayThing.token, "/api/v1/courses?access_token=", "&enrollment_state=active"));
    if (betterConsole) {console.log("Sent canvas data...");}
  }
  catch (error) {res.send("Not correct way to send data"); console.error(error)};
});
app.get('/classesData', async (req, res) => {
  if (betterConsole) {console.log("Getting class data..")};
  let arrayThing = req.query;
  console.log
  try {
    if (!arrayThing.token) {throw new Error("crash.");}
    let data = await canvasAPI(arrayThing.token, "/api/v1/courses?access_token=", "&enrollment_state=active"); let output;
    let classNames = "";
    for (let i = 0; i<data.length; i++) {
      classNames += data[i].name + "<br>";
    }
    output = (
      "Amount of classes: " + data.length + "<br>" +
      classNames + "<br>"

    );


    res.send(output);
    if (betterConsole) {console.log("Sent canvas data...");}
  }
  catch (error) {res.send("Not correct way to send data"); console.error(error)};
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, LISTENING, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Listening on ${LISTENING}`);
});