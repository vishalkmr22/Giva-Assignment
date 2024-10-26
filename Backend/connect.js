const express = require('express');
const { Client } = require('pg');
const morgan = require('morgan');

const port = 3000;

const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const client = new Client({
    user: 'vishal',
    host: 'localhost',
    database: 'giva',
    password: 'vishal',
    port: 5432,
});

client.connect()
    .then(() => console.log("Connected to PostgreSQL database"))
    .catch((err) => console.error("Connection error", err.stack));

app.get('/products', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM products');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("An error occurred while fetching products.");
    }
});

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await client.query('SELECT * FROM products WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/products', async (req, res) => {
    const { name, description, price, available_quantity } = req.body;

    if (!name || !description || !price || !available_quantity) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const result = await client.query(
            'INSERT INTO products (name, description, price, available_quantity) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, price, available_quantity]
        );
        res.status(201).json(result.rows[0]); 
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).send("An error occurred while adding the product.");
    }
});

app.put('/product/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, available_quantity } = req.body;
  
    try {
      const result = await client.query(
        'UPDATE products SET name = $1, description = $2, price = $3, available_quantity = $4 WHERE id = $5 RETURNING *',
        [name, description, price, available_quantity, id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await client.query(
            'DELETE FROM products WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send("An error occurred while deleting the product.");
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
