const signupForm = document.querySelector('.auth-form');

signupForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const fullName = this.querySelector('input[type="text"]').value;
  const email = this.querySelector('input[type="email"]').value;
  const password = this.querySelector('input[type="password"]').value;

  // Save user in localStorage
  const user = { fullName, email, password, orders: [], cart: [] };
  localStorage.setItem(email, JSON.stringify(user));

  // Log in the user automatically
  localStorage.setItem('loggedInUser', email);
  window.location.href = 'dashboard.html';
});
