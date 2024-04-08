const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Message = require('../models/message');

const verifyToken = require('../middleware/authMiddleware');

mongoose.connect('mongodb://root:p%40ssw0rd@localhost:27017', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

router.post('/message', async function (req, res, next) {   
    const payload = req.body;  
    const message = new Message(payload);
    await message.save().then(() => {
        res.send(req.body);
    });
});

router.get('/message/search', verifyToken, async function (req, res) {
    const { name } = req.query;
    let query = {};

    if (name) {
        query = { name };
    }

    try {
        const message = await Message.find(query);
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/messages', async function (req, res) {
    const { skip = 0, limit = 10 } = req.query;
    try {
        const messages = await Message.find().skip(parseInt(skip)).limit(parseInt(limit));
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async function (req, res) {
    const { id } = req.params;
    const message = await Message.findById(id);
    res.json(message);
});

router.put('/:id', async (req, res) => {
    const payload = req.body;
    const { id } = req.params;
    const message = await Message.findByIdAndUpdate(id, { $set: payload });
    res.json(message);
});

router.delete('/messages/:id', async (req, res) => {
    const { id } = req.params;
    await Message.findByIdAndDelete(id).then(() => {
        res.status(200).end();
    });
});

module.exports = router;