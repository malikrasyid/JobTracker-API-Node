import { Router } from 'express';
import { 
    getPipelines, 
    getPipelineById, 
    createPipeline, 
    updatePipeline, 
    deletePipeline 
} from '../controllers/pipelineController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// All pipeline routes require authentication
router.use(authMiddleware);

// GET /api/pipelines
router.get('/', getPipelines);

// GET /api/pipelines/:id
router.get('/:id', getPipelineById);

// POST /api/pipelines
router.post('/', createPipeline);

// PUT /api/pipelines/:id
router.put('/:id', updatePipeline);

// DELETE /api/pipelines/:id
router.delete('/:id', deletePipeline);

export default router;