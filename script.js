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

  window.location.href = 'dashboard.html';

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

document.addEventListener('DOMContentLoaded', () => {
    // 1. Grab all the elements we need
    const modal = document.getElementById('addProductModal');
    const openModalBtn = document.querySelector('.header .add-btn');
    const closeModalBtn = document.querySelector('.close-btn');
    const form = document.getElementById('addProductForm');
    const tableBody = document.querySelector('tbody');

    // 2. Open the Modal when "Add Product" is clicked
    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    // 3. Close the Modal when the "X" is clicked
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // 4. Close the Modal if you click outside the box
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 5. Handle Form Submission (Adding a new product)
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop page from refreshing

        // Get the values the user typed in
        const name = document.getElementById('productName').value;
        const category = document.getElementById('productCategory').value;
        const price = document.getElementById('productPrice').value;
        const stock = parseInt(document.getElementById('productStock').value);

        // Generate a random Item ID for the prototype
        const randomId = '#' + Math.floor(Math.random() * 9000 + 1000);

        // Figure out if it is In Stock or Low Stock (let's say less than 10 is low)
        const statusClass = stock > 10 ? 'in-stock' : 'low-stock';
        const statusText = stock > 10 ? 'In Stock' : 'Low Stock';

        // Create a new table row
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${randomId}</td>
            <td>${name}</td>
            <td>${category}</td>
            <td>₹${price}</td>
            <td>${stock}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>
                <button class="action-btn edit"><i class='bx bx-edit'></i></button>
                <button class="action-btn delete"><i class='bx bx-trash'></i></button>
            </td>
        `;

        // Add the new row to the bottom of the table
        tableBody.appendChild(newRow);

        // Clear the form and hide the modal
        form.reset();
        modal.style.display = 'none';
    });

    // 6. Handle Deleting a Row
    // We listen on the whole table body so it works for newly added rows too
    tableBody.addEventListener('click', (e) => {
        // Check if the clicked element (or its parent icon) has the 'delete' class
        if (e.target.closest('.delete')) {
            if (confirm('Are you sure you want to delete this product?')) {
                // Find the closest table row (<tr>) and remove it
                e.target.closest('tr').remove();
            }
        }
    });
});