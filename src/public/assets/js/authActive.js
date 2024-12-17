// Login, signup
const authcontainer = document.getElementById("Authcontainer");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

registerBtn.addEventListener("click", () => {
  authcontainer.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  authcontainer.classList.remove("active");
});