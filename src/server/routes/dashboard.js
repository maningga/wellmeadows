import express from 'express';
import { getDashboardData } from '../../api/dashboard';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await getDashboardData();
    res.json(data);
  } catch (error) {
    console.error('Error in dashboard route:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router; 