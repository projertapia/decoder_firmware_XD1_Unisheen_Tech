function xc_gethost() {
    return window.location.host;
    //return '192.168.3.100';
}
function dinamic_ip(){
	var playlistConfigSpan = document.getElementById("url-launch");
    var checkCredentials = document.getElementById("checkCredentials");
	var dynamicIP = xc_gethost();
	playlistConfigSpan.innerHTML = playlistConfigSpan.innerHTML.replace(/192\.168\.1\.168/g, dynamicIP);
    const user = localStorage.getItem("user");
    const pass = localStorage.getItem("pass");
    const useCredentials = localStorage.getItem("checkCredentials");
    current = 'username:password@';
    // Verificar si la variable existe y no está vacía
    if ((user !== null && user !== "")&&(pass !== null && pass !== "")) {
        createUrlsPull(user,pass,current);
    }else if(useCredentials == 0){
        localStorage.setItem("user", '');
        localStorage.setItem("pass", '');
    }else{
        localStorage.setItem("user", 'username');
        localStorage.setItem("pass", 'password');
    }
    if(useCredentials == 1 && useCredentials !== ""){
        checkCredentials.checked=true;
    }else if(useCredentials == 0 && useCredentials !== ""){
        checkCredentials.checked=false;
    }else{
        checkCredentials.checked=true;
        localStorage.setItem("checkCredentials",1);
        
    }
}
function openSettings(modal,action){
   
    let modalDiv = document.getElementById(modal);
    let blackout = document.getElementById('blackout');
    if(action == 'open'){
        blackout.classList.add("open");
        let userInput = document.getElementById(modal+'-user');
        let passInput = document.getElementById(modal+'-pass');
        modalDiv.classList.add("open");
        let user = localStorage.getItem("user");
        let pass = localStorage.getItem("pass");
        passInput.value = pass;
        userInput.value = user;
    }else{
        modalDiv.classList.remove("open");
        blackout.classList.remove("open");
    }
};
function saveOaut(IDuser,IDpass,IDCheck,modal){
    let user = document.getElementById(IDuser).value;    
    let pass = document.getElementById(IDpass).value;
    let check = document.getElementById(IDCheck).checked;
    let userLast = localStorage.getItem("user");
    let passLast = localStorage.getItem("pass");
    openSettings(modal,'close');
    current = userLast+':'+passLast+'@';
    if(check){
        checkValue = 1;
    }else{// Reemplazar las variables dinámicamente utilizando las expresiones regulares
        checkValue = 0;
    }
    createUrlsPull(user,pass,current);
    localStorage.setItem("user", user);
    localStorage.setItem("pass", pass);
    localStorage.setItem("checkCredentials", checkValue);
}
function createUrlsPull(newuser,newpass,current){
    const useCredentials = localStorage.getItem("checkCredentials");
    let userRegex = new RegExp(current, 'g');
    var playlistConfigSpan = document.getElementById("url-launch");
    if(useCredentials==1){
        credentialsQuery = newuser+':'+newpass+'@';
    }else{
        credentialsQuery = '';
    }
    const replacedHTML = playlistConfigSpan.innerHTML.replace(userRegex, credentialsQuery)
        playlistConfigSpan.innerHTML = replacedHTML;
}

