import { Router } from 'express';
import { 
    getJobs, 
    getJobById, 
    getJobsByStage, 
    createJob, 
    updateJob, 
    deleteJob 
} from '../controllers/jobController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// All job routes require authentication
router.use(authMiddleware);

// GET /api/jobs
router.get('/', getJobs);

// GET /api/jobs/:id
router.get('/:id', getJobById);

// GET /api/jobs/stage/:stage
router.get('/stage/:stage', getJobsByStage);

// POST /api/jobs
router.post('/', createJob);

// PUT /api/jobs/:id
router.put('/:id', updateJob);

// DELETE /api/jobs/:id
router.delete('/:id', deleteJob);

export default router;