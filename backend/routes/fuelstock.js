import express from 'express';
import Branch from '../models/branch.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const branches = await Branch.find();
    if (!branches.length) {
      return res.status(404).json({ message: 'No branches found' });
    }
    res.json(branches);
  } catch (error) {
    console.error('Error fetching branches:', error.message);
    res.status(500).json({ error: 'Failed to fetch branches' });
  }
});

export default router;
