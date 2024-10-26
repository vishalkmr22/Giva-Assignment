import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Product from './Product';
import EditProduct from './EditProduct'; 
import AddProduct from './AddProduct'; 

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Product/>} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/edit-product/:id" element={<EditProduct />} /> {}
            </Routes>
        </Router>
    );
};

export default App;
