document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Store user data (demo purpose)
  const user = {
    name: name,
    email: email,
    password: password
  };

  localStorage.setItem(email, JSON.stringify(user));

  alert("Signup successful!");
  window.location.href = "signin.html";
});
