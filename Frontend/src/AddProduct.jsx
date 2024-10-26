import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Product.css';  // This imports Product.css

const AddProduct = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        available_quantity: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validate = () => {
        let tempErrors = {};
        tempErrors.name = formData.name ? "" : "Name is required.";
        tempErrors.description = formData.description ? "" : "Description is required.";
        tempErrors.price = formData.price && parseFloat(formData.price) > 0 ? "" : "Price must be a positive number.";
        tempErrors.available_quantity = formData.available_quantity && parseInt(formData.available_quantity, 10) >= 0 
            ? "" : "Available quantity must be a non-negative integer.";
        
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const response = await fetch('http://localhost:3000/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert('Product added successfully');
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    available_quantity: '',
                });
                navigate('/');
            } else {
                throw new Error('Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        }
    };

    return (
        <div className="product-entry-form">  // Changed to match CSS for form styling
            <h1>Add a New Product</h1>
            <form className="product-entry" onSubmit={handleSubmit}>  // Changed to apply the right flex styling
                <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name}
                />
                <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                    error={!!errors.description}
                    helperText={errors.description}
                />
                <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                    error={!!errors.price}
                    helperText={errors.price}
                />
                <TextField
                    label="Available Quantity"
                    name="available_quantity"
                    type="number"
                    value={formData.available_quantity}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                    error={!!errors.available_quantity}
                    helperText={errors.available_quantity}
                />
                <Button variant="contained" color="primary" type="submit">
                    Add Product
                </Button>
            </form>
        </div>
    );
};

export default AddProduct;
