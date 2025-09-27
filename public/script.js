let canvasToken = "";
window.onload = function() {
    try {
        canvasToken = localStorage.getItem("token");
        if (canvasToken === null || canvasToken === undefined) {throw new Error("ok")};
    }
    catch(error) {setToken();}
};
function setToken() {
    let token = prompt("Enter your Canvas API Token");
    canvasToken = token;
    localStorage.setItem("token", token);
    document.getElementById("token").innerHTML = canvasToken.substring(0, 4);
}