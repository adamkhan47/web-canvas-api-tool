let canvasToken;
window.onload = function() {
    try {
        canvasToken = localStorage.getItem("token");
        if (canvasToken === null || canvasToken === undefined) {throw new Error("ok")};
    }
    catch(error) {setToken();}
};
function setToken() {
    let token = prompt("Enter your Canvas API Token");
    canvasToken = thing;
    localStorage.setItem("token", token);
    document.getElementById("token").innerHTML = token.substring(0, 4);
}