import express from 'express';
import * as recordController from '../controllers/recordController.js';
import * as authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware.protect);

router
  .route('/')
  .get(recordController.getAllRecords)
  .post(authMiddleware.restrictTo('admin'), recordController.createRecord);

router
  .route('/:id')
  .get(recordController.getRecord)
  .patch(authMiddleware.restrictTo('admin'), recordController.updateRecord)
  .delete(authMiddleware.restrictTo('admin'), recordController.deleteRecord);

export default router;
