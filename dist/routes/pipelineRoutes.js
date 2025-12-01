"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pipelineController_1 = require("../controllers/pipelineController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// All pipeline routes require authentication
router.use(authMiddleware_1.authMiddleware);
// GET /api/pipelines
router.get('/', pipelineController_1.getPipelines);
// GET /api/pipelines/:id
router.get('/:id', pipelineController_1.getPipelineById);
// POST /api/pipelines
router.post('/', pipelineController_1.createPipeline);
// PUT /api/pipelines/:id
router.put('/:id', pipelineController_1.updatePipeline);
// DELETE /api/pipelines/:id
router.delete('/:id', pipelineController_1.deletePipeline);
exports.default = router;
