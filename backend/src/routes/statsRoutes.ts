import { Router } from 'express';
import { getGitHubStatsController, getLeetCodeStatsController } from '../controllers/statsController.js';

const router = Router();

router.get(['/github/stats', '/github'], getGitHubStatsController);
router.get(['/leetcode/stats', '/leetcode'], getLeetCodeStatsController);

export default router;
