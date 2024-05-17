const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');

const verifyToken = require('../middleware/authMiddleware');

var host = 'localhost';
if(process.env.NODE_ENV === 'production'){
  host = 'mongodb'
}

mongoose.connect(`mongodb://root:password@mongodb:27017/test?authSource=admin`, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

router.post('/product', async function (req, res, next) {   
    const payload = req.body;  
    const product = new Product(payload);
    await product.save().then(() => {
        res.send(req.body);
    });
});

router.get('/products/search', verifyToken, async function (req, res) {
    const { name } = req.query;
    let query = {};

    if (name) {
        query = { name };
    }

    try {
        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/products', async function (req, res) {
    const { skip = 0, limit = 10 } = req.query;
    try {
        const products = await Product.find().skip(parseInt(skip)).limit(parseInt(limit));
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async function (req, res) {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.json(product);
});

router.put('/:id', async (req, res) => {
    const payload = req.body;
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { $set: payload });
    res.json(product);
});

router.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id).then(() => {
        res.status(200).end();
    });
});

module.exports = router;