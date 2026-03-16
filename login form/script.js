const wrapper = document.querySelector('.wrapper');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');

// Adds the 'active' class to slide to the Register panel
registerLink.onclick = () => {
  wrapper.classList.add('active');
};

// Removes the 'active' class to slide back to the Login panel
loginLink.onclick = () => {
  wrapper.classList.remove('active');
};