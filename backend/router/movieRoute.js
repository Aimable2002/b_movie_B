import express from 'express'
import { authenticateRoute } from '../middleware/protectRoute.js'
import { 
    uploadMovie, 
    getMovieByExternalUrl, 
    getAllMovies,
    updateMovie, 
    deleteMovie,
    getDownloadUrl,
    getStreamUrl,
    directDownload
} from '../controller/movieController.js'

const router = express.Router()

// Public routes (for external website requests)
router.get('/get/movie', getMovieByExternalUrl)
router.get('/download/:id', getDownloadUrl)
router.get('/stream/:id', getStreamUrl)

router.get("/direct/download", directDownload);


// Protected routes (require authentication)
router.post('/upload', authenticateRoute, uploadMovie)
router.get('/all', authenticateRoute, getAllMovies)
router.put('/update/:id', authenticateRoute, updateMovie)
router.delete('/delete/:id', authenticateRoute, deleteMovie)

export default router
