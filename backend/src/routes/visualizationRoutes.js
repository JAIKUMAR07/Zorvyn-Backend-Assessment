import express from 'express';
import * as visualizationController from '../controllers/visualizationController.js';
import * as authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All visualization routes require authentication
router.use(authMiddleware.protect);

router.get('/monthly', visualizationController.getMonthlyComparison);
router.get('/categories', visualizationController.getCategoryBreakdown);
router.get('/trends', visualizationController.getTrends);
router.get('/stacked', visualizationController.getStackedCategory);
router.get('/top-expenses', visualizationController.getTopExpenses);
router.get('/cashflow', visualizationController.getCashFlow);
router.get('/compare', visualizationController.getComparison);

export default router;
