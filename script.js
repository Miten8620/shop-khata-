document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. LOGIN & REGISTRATION PAGE LOGIC
    // ==========================================
    const wrapper = document.querySelector('.wrapper');
    
    if (wrapper) {
        const registerLink = document.querySelector('.register-link');
        const loginLink = document.querySelector('.login-link');
        const loginForm = document.querySelector('.form-box.login form');
        const registerForm = document.querySelector('.form-box.register form');

        if (registerLink && loginLink) {
            registerLink.onclick = () => wrapper.classList.add('active');
            loginLink.onclick = () => wrapper.classList.remove('active');
        }

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault(); 
                alert("Login Successful! Redirecting to your shop dashboard...");
                window.location.href = 'dashboard.html';
                loginForm.reset(); 
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault(); 
                alert("Shop Registration Successful! You can now log in.");
                registerForm.reset(); 
                wrapper.classList.remove('active'); 
            });
        }
    }


    // ==========================================
    // 2. INVENTORY PAGE LOGIC
    // ==========================================
    const inventoryTableBody = document.querySelector('tbody:not(#paymentTableBody)');
    const inventoryModal = document.getElementById('addProductModal');

    if (inventoryTableBody && inventoryModal) {
        const openModalBtn = document.querySelector('.header .add-btn');
        const closeModalBtn = inventoryModal.querySelector('.close-btn');
        const form = document.getElementById('addProductForm');
        
        const modalTitle = inventoryModal.querySelector('h2');
        const submitBtn = form.querySelector('button[type="submit"]');
        let currentRowBeingEdited = null;

        function resetInventoryModal() {
            form.reset();
            currentRowBeingEdited = null;
            modalTitle.innerText = "Add New Product";
            submitBtn.innerText = "Save Product";
            inventoryModal.style.display = 'none';
        }

        openModalBtn.addEventListener('click', () => {
            resetInventoryModal(); 
            inventoryModal.style.display = 'flex';
        });

        closeModalBtn.addEventListener('click', resetInventoryModal);
        window.addEventListener('click', (e) => {
            if (e.target === inventoryModal) resetInventoryModal();
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault(); 

            const name = document.getElementById('productName').value;
            const category = document.getElementById('productCategory').value;
            const price = document.getElementById('productPrice').value;
            const stock = parseInt(document.getElementById('productStock').value);

            const statusClass = stock > 10 ? 'in-stock' : 'low-stock';
            const statusText = stock > 10 ? 'In Stock' : 'Low Stock';

            if (currentRowBeingEdited) {
                const cells = currentRowBeingEdited.querySelectorAll('td');
                cells[1].innerText = name;
                cells[2].innerText = category;
                cells[3].innerText = `₹${price}`;
                cells[4].innerText = stock;
                cells[5].innerHTML = `<span class="status ${statusClass}">${statusText}</span>`;
            } else {
                const randomId = '#' + Math.floor(Math.random() * 9000 + 1000);
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
                inventoryTableBody.appendChild(newRow);
            }
            resetInventoryModal(); 
        });

        inventoryTableBody.addEventListener('click', (e) => {
            if (e.target.closest('.delete')) {
                if (confirm('Are you sure you want to delete this product?')) {
                    e.target.closest('tr').remove();
                }
            }

            if (e.target.closest('.edit')) {
                const row = e.target.closest('tr');
                const cells = row.querySelectorAll('td');

                const name = cells[1].innerText;
                const category = cells[2].innerText;
                const price = cells[3].innerText.replace('₹', '').replace(/,/g, '').trim(); 
                const stock = cells[4].innerText;

                document.getElementById('productName').value = name;
                document.getElementById('productCategory').value = category;
                document.getElementById('productPrice').value = price;
                document.getElementById('productStock').value = stock;

                currentRowBeingEdited = row;
                modalTitle.innerText = "Edit Product";
                submitBtn.innerText = "Update Product";
                inventoryModal.style.display = 'flex';
            }
        });
    }


    // ==========================================
    // 3. PAYMENTS & UDHAAR PAGE LOGIC
    // ==========================================
    const paymentTableBody = document.getElementById('paymentTableBody');
    const paymentModal = document.getElementById('paymentModal');

    // Safety check: Only run if we are on the Payments page
    if (paymentTableBody && paymentModal) {
        const openPaymentBtn = document.getElementById('openPaymentModal');
        const closePaymentBtn = document.getElementById('closePaymentModal');
        const paymentForm = document.getElementById('paymentForm');
        
        const payModalTitle = paymentModal.querySelector('h2');
        const paySubmitBtn = paymentForm.querySelector('button[type="submit"]');
        let currentPaymentRow = null;

        // Automatically format today's date (e.g., 18-Mar-2026)
        function getFormattedDate() {
            const today = new Date();
            return today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
        }

        function resetPaymentModal() {
            paymentForm.reset();
            currentPaymentRow = null;
            payModalTitle.innerText = "Record Transaction";
            paySubmitBtn.innerText = "Save Record";
            paymentModal.style.display = 'none';
        }

        openPaymentBtn.addEventListener('click', () => {
            resetPaymentModal();
            paymentModal.style.display = 'flex';
        });

        closePaymentBtn.addEventListener('click', resetPaymentModal);
        window.addEventListener('click', (e) => {
            if (e.target === paymentModal) resetPaymentModal();
        });

        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault(); 

            const name = document.getElementById('custName').value;
            const mobile = document.getElementById('custMobile').value;
            const amount = document.getElementById('payAmount').value;
            const typeValue = document.getElementById('payType').value;

            // Determine if it's Udhaar or Received
            const statusClass = typeValue === 'received' ? 'received' : 'udhaar';
            const statusText = typeValue === 'received' ? 'Payment Received' : 'Udhaar (Due)';

            if (currentPaymentRow) {
                // EDIT MODE: Update existing transaction
                const cells = currentPaymentRow.querySelectorAll('td');
                // We leave the date (cells[0]) exactly as it was when created
                cells[1].innerText = name;
                cells[2].innerText = mobile;
                cells[3].innerText = `₹${amount}`;
                cells[4].innerHTML = `<span class="status ${statusClass}">${statusText}</span>`;
            } else {
                // ADD MODE: Create a new row with today's date
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${getFormattedDate()}</td>
                    <td>${name}</td>
                    <td>${mobile}</td>
                    <td>₹${amount}</td>
                    <td><span class="status ${statusClass}">${statusText}</span></td>
                    <td>
                        <button class="action-btn edit"><i class='bx bx-edit'></i></button>
                        <button class="action-btn delete"><i class='bx bx-trash'></i></button>
                    </td>
                `;
                paymentTableBody.appendChild(newRow);
            }
            resetPaymentModal(); 
        });

        // Table actions for Edit and Delete
        paymentTableBody.addEventListener('click', (e) => {
            
            // Delete Action
            if (e.target.closest('.delete')) {
                if (confirm('Are you sure you want to delete this transaction record?')) {
                    e.target.closest('tr').remove();
                }
            }

            // Edit Action
            if (e.target.closest('.edit')) {
                const row = e.target.closest('tr');
                const cells = row.querySelectorAll('td');

                const name = cells[1].innerText;
                const mobile = cells[2].innerText;
                const amount = cells[3].innerText.replace('₹', '').replace(/,/g, '').trim(); 
                
                // Check the class of the span to figure out if it was received or udhaar
                const statusSpan = cells[4].querySelector('span');
                const typeValue = statusSpan.classList.contains('received') ? 'received' : 'udhaar';

                // Fill the form
                document.getElementById('custName').value = name;
                document.getElementById('custMobile').value = mobile;
                document.getElementById('payAmount').value = amount;
                document.getElementById('payType').value = typeValue;

                // Set up "Edit" state
                currentPaymentRow = row;
                payModalTitle.innerText = "Edit Transaction";
                paySubmitBtn.innerText = "Update Record";
                paymentModal.style.display = 'flex';
            }
        });
    }

});