let canvasToken = "";
window.onload = async () => {
    try {
        canvasToken = localStorage.getItem("token");
        if (canvasToken === null || canvasToken === undefined || canvasToken === "null" || canvasToken === "") {throw new Error("ok")};
        setPfpAndUser();
    }
    catch(error) {
        setToken();
        document.getElementById("name").innerHTML = "Login...";
        document.getElementById("pfp").src = 'nopfp.png';
    }
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
    document.getElementById("name").innerHTML = name;
    document.getElementById("pfp").src = pfp;
}
async function cleanJson() {
    const res = await fetch('/cleanJson?token='+canvasToken);
    const data = await res.text();
    document.getElementById("dataText").innerHTML = data;
}
async function courseData() {
    const res = await fetch('/rawClassesData?token='+canvasToken);
    const data = await res.text();
    document.getElementById("dataText").innerHTML = data;
}