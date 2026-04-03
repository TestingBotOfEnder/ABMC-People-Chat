const express = require('express');
const Channel = require('../models/Channel');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, description, isPrivate } = req.body;
        const channel = new Channel({ name, description, isPrivate, createdBy: req.userId, members: [req.userId] });
        await channel.save();
        res.json(channel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const channels = await Channel.find({ isPrivate: false }).populate('createdBy', 'username');
        res.json(channels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const channel = await Channel.findById(req.params.id).populate('members', 'username avatar status');
        res.json(channel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/join', authMiddleware, async (req, res) => {
    try {
        const channel = await Channel.findByIdAndUpdate(req.params.id, { $addToSet: { members: req.userId } }, { new: true });
        res.json(channel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;