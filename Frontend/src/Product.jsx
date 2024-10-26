import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import './Product.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3000/products');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            console.log("Fetched products:", data); 
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    
    const deleteProduct = async (id) => {
        try {
            await fetch(`http://localhost:3000/products/${id}`, {
                method: 'DELETE',
            });
            fetchProducts(); 
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <div className="product-list-container">
            <h1 className="product-list-heading">Product List</h1>
            <Button
                variant="contained"
                color="primary"
                className="add-product-button"
                href="/add-product"
                style={{ position: 'absolute', top: '10px', right: '20px' }}
            >
                Add a Product
            </Button>
            {products.length === 0 ? (
                <p>No products available</p>
            ) : (
                <div className="product-list">
                    {products.map((product) => (
                        <div key={product.id} className="product-item">
                            <h2>{product.name}</h2>
                            <p>{product.description}</p>
                            <p>Price: ${product.price}</p>
                            <p>Available Quantity: {product.available_quantity}</p>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => navigate(`/edit-product/${product.id}`)} // Navigate to EditProduct
                                style={{ marginRight: '10px' }}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => deleteProduct(product.id)}
                            >
                                Delete
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;
