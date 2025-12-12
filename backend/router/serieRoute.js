// serieRoute.js - FIXED VERSION
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

// SPECIFIC ROUTES FIRST
router.get('/all', (req, res) => {
    console.log('req, body in route :', req.body)
    return getAllSeries(req, res);
});

// DYNAMIC ROUTES LAST
router.get('/season/:id', getSeasonById);
router.get('/episode/:id', getEpisodeById);
router.get('/:id', getSeriesById);

router.post('/create', authenticateRoute, createSeries);
router.put('/update/:id', authenticateRoute, updateSeries);
router.delete('/delete/:id', authenticateRoute, deleteSeries);

export default router;