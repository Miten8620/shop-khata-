const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Added bcrypt for password hashing

const app = express();

app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
const connectDB = async () => {
  try {
    const conn = await mysql.createConnection({
      host : "localhost",
      user : "root",
      password : "root", // Make sure this matches your MySQL password
      database : "shop_managemet", // Make sure this matches your DB name exactly
      port : 3306
    });
    // console.log("Server connected to DB"); // Commented out to prevent console spam on every request
    return conn;
  } catch(err) {
    console.log("Database error : ", err);
  }
}

// ==========================================
// AUTHENTICATION ROUTES (Login / Register)
// ==========================================

app.post('/api/register', async (req, res) => {
  try {
    const conn = await connectDB();
    const {shopName, ownerName, number, email, password} = req.body ?? {};
    
    if(!shopName || !ownerName || !number || !email || !password) {
      return res.status(400).json({ status : false, message : "All fields are required" });
    }

    // Hash the password BEFORE saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO shops (shop_name, owner_name, mobile, email, password) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await conn.execute(sql, [shopName, ownerName, number, email, hashedPassword]);

    return res.status(201).json({ status: true, result : result });
  } catch(err) {
    console.log(err);
    return res.status(500).json({ status : false, message : "Server error" });
  }
});

app.post('/login', async (req, res) => {
  try {
    const conn = await connectDB();
    const { identifier, password } = req.body; 

    // Find the user by email or mobile
    const sql = 'SELECT * FROM shops WHERE email = ? OR mobile = ?';
    const [results] = await conn.execute(sql, [identifier, identifier]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = results[0];

    // Compare the plain text password with the hashed password from the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      delete user.password; // Remove password before sending to frontend
      res.status(200).json({ message: 'Login successful!', user: user });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error verifying password' });
  }
});

// ==========================================
// INVENTORY CRUD ROUTES
// ==========================================

// 1. READ: Get all products for a specific shop
app.get('/products/:shop_id', async (req, res) => {
    try {
        const conn = await connectDB();
        const shopId = req.params.shop_id;
        
        const sql = 'SELECT * FROM products WHERE shop_id = ? ORDER BY id DESC';
        const [results] = await conn.execute(sql, [shopId]);
        
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve products' });
    }
});

// 2. CREATE: Add a new product
app.post('/products', async (req, res) => {
    try {
        const conn = await connectDB();
        const { shop_id, productName, category, price, stock } = req.body;
        
        const sql = 'INSERT INTO products (shop_id, product_name, category, price, stock) VALUES (?, ?, ?, ?, ?)';
        const [result] = await conn.execute(sql, [shop_id, productName, category, price, stock]);
        
        res.status(201).json({ message: 'Product added!', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add product' });
    }
});

// 3. UPDATE: Edit an existing product
app.put('/products/:id', async (req, res) => {
    try {
        const conn = await connectDB();
        const productId = req.params.id;
        const { shop_id, productName, category, price, stock } = req.body;

        const sql = 'UPDATE products SET product_name = ?, category = ?, price = ?, stock = ? WHERE id = ? AND shop_id = ?';
        const [result] = await conn.execute(sql, [productName, category, price, stock, productId, shop_id]);
        
        res.status(200).json({ message: 'Product updated!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// 4. DELETE: Remove a product
app.delete('/products/:id', async (req, res) => {
    try {
        const conn = await connectDB();
        const productId = req.params.id;
        const { shop_id } = req.body; 

        const sql = 'DELETE FROM products WHERE id = ? AND shop_id = ?';
        const [result] = await conn.execute(sql, [productId, shop_id]);
        
        res.status(200).json({ message: 'Product deleted!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// --- START SERVER ---
app.listen(3000, () => {
  console.log("Server started on port 3000");
});