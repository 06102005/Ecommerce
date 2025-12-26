const signinForm = document.querySelector('.auth-form');

signinForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const email = this.querySelector('input[type="email"]').value;
  const password = this.querySelector('input[type="password"]').value;

  const user = JSON.parse(localStorage.getItem(email));

  if (user && user.password === password) {
    localStorage.setItem('loggedInUser', email);
    window.location.href = 'dashboard.html';
  } else {
    alert('Invalid email or password!');
  }
});

