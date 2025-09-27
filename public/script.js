let canvasToken = "";
window.onload = async () => {
    try {
        canvasToken = localStorage.getItem("token");
        if (canvasToken === null || canvasToken === undefined) {throw new Error("ok")};
        setPfpAndUser();
    }
    catch(error) {setToken();}
};

function setToken() {
    let token = prompt("Enter your Canvas API Token");
    canvasToken = token;
    localStorage.setItem("token", token);
    setPfpAndUser();
}
async function retrieveCanvasRawData() {
    const res = await fetch('/rawData?token='+canvasToken);
    const data = await res.text();
    document.getElementById("dataText").innerHTML = data;
}
async function setPfpAndUser() {
    const res = await fetch('/rawData?token='+canvasToken);
    const data = await res.text();
    let actualData = JSON.parse(data);
    let pfp = actualData.avatar_url;
    let name = actualData.first_name;
    document.getElementById("name").innerHTML = name + "  "+ '<img src="' + pfp + '" alt="Username">';
}
