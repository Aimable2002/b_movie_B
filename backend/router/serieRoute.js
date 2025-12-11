// routes/seriesRoutes.js
import express from 'express';
import { 
  getAllSeries, 
  getSeriesById, 
  createSeries, 
  updateSeries, 
  deleteSeries, 
  getSeasonById, 
  getEpisodeById 
} from '../controller/serieController.js';
import { authenticateRoute } from '../middleware/protectRoute.js';

const router = express.Router();


router.get('/:id', getSeriesById);
router.get('/season/:id', getSeasonById);
router.get('/episode/:id', getEpisodeById);

router.get('/all', authenticateRoute, getAllSeries);
router.post('/create', authenticateRoute, createSeries);
router.put('/update/:id', authenticateRoute, updateSeries);
router.delete('/delete/:id', authenticateRoute, deleteSeries);

export default router