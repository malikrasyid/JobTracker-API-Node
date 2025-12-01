"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobController_1 = require("../controllers/jobController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// All job routes require authentication
router.use(authMiddleware_1.authMiddleware);
// GET /api/jobs
router.get('/', jobController_1.getJobs);
// GET /api/jobs/:id
router.get('/:id', jobController_1.getJobById);
// GET /api/jobs/stage/:stage
router.get('/stage/:stage', jobController_1.getJobsByStage);
// POST /api/jobs
router.post('/', jobController_1.createJob);
// PUT /api/jobs/:id
router.put('/:id', jobController_1.updateJob);
// DELETE /api/jobs/:id
router.delete('/:id', jobController_1.deleteJob);
exports.default = router;
