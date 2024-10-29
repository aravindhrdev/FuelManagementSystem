import express from 'express';
import RestockRequest from '../models/restock.js';

const restock = express.Router();

restock.get('/', async (req, res) => {
  try {
    const requests = await RestockRequest.find().sort({ requested_at: -1 }).limit(10);
    res.json(requests);
  } catch (error) {
    console.error('Error fetching restock requests:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default restock;
