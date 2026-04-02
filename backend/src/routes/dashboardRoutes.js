import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import * as authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/summary', dashboardController.getSummary);
router.get('/recent', dashboardController.getRecentActivity);
router.get('/category-stats', dashboardController.getCategoryStats);
router.get('/trends', authMiddleware.restrictTo('analyst', 'admin'), dashboardController.getTrends);

export default router;
