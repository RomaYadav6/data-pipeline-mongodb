import express from 'express';
import { create, fetch, update, deleteMetric } from '../controllers/Metricontroller.js';
const router = express.Router();
// Create a new metric
router.post('/', create);
// Get all metrics
router.get('/', fetch);
// Update a metric by ID
router.put('/:id', update);
// Delete a metric by ID
router.delete('/:id', deleteMetric);
export default router;
