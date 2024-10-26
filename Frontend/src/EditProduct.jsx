import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditProduct.css';  // This imports EditProduct.css correctly

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    available_quantity: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/${id}`);
        if (!response.ok) throw new Error('Could not fetch product');
        const data = await response.json();
        setProduct({
          name: data.name,
          description: data.description,
          price: data.price,
          available_quantity: data.available_quantity, 
        });
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          price: parseFloat(product.price),
          available_quantity: parseInt(product.available_quantity, 10),
        }),
      });
      if (response.ok) {
        navigate('/');  // Redirecting to the home page or list after update
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  return (
    <div className="product-edit-wrapper">  // Uses .product-edit-wrapper for styling
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit} className="product-edit-form">  // Uses .product-edit-form for styling
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            step="0.01"  // Ensures decimal values can be entered for prices
          />
        </label>
        <label>
          Available Quantity:
          <input
            type="number"
            name="available_quantity"
            value={product.available_quantity}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default EditProduct;
