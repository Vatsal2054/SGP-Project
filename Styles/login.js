
var reg = document.querySelector(".register_anchor");
reg.addEventListener("click", register, false);

function register(){
    var content = document.querySelector(".register_anchor").textContent;
    
    if(content === "Register"){
        document.querySelector(".register_anchor").attributes.setAttribute("required`, true");
        document.querySelector("h1").textContent = "Sign Up";
        document.querySelector(".no_acc span").textContent = "Already have an account?";
        document.querySelector(".register_anchor").textContent = "Login";
        document.querySelector(".l1").setAttribute("style", "display: block;");

    }else if(content === "Login"){
        document.querySelector(".register_anchor").attributes.setAttribute("required`, false");
        document.querySelector("h1").textContent = "Login";
        document.querySelector(".no_acc span").textContent = "Don't have an account?";
        document.querySelector(".register_anchor").textContent = "Register";
        document.querySelector(".l1").setAttribute("style", "display: none;");
    }
}