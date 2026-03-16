const wrapper = document.querySelector('.wrapper');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');

// --- SLIDE ANIMATIONS ---
registerLink.onclick = () => {
  wrapper.classList.add('active');
};

loginLink.onclick = () => {
  wrapper.classList.remove('active');
};


// --- FORM SUBMISSION HANDLING ---

// 1. Select the forms
const loginForm = document.querySelector('.form-box.login form');
const registerForm = document.querySelector('.form-box.register form');

// 2. Handle Login Submit
loginForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Stops the page from refreshing
  
  alert("Login Successful! Redirecting to your shop dashboard...");
  
  loginForm.reset(); // Clears the input fields
});

// 3. Handle Registration Submit
registerForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Stops the page from refreshing
  
  alert("Shop Registration Successful! You can now log in.");
  
  registerForm.reset(); // Clears the input fields
  
  // Automatically slide back to the login page after successful registration
  wrapper.classList.remove('active'); 
});