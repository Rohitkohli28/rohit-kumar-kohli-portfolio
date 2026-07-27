import { Request, Response } from 'express';
import { getGitHubStatsService } from '../services/githubService.js';
import { getLeetCodeStatsService } from '../services/leetcodeService.js';

export async function getGitHubStatsController(req: Request, res: Response): Promise<void> {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const stats = await getGitHubStatsService();
  res.json(stats);
}

export async function getLeetCodeStatsController(req: Request, res: Response): Promise<void> {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const stats = await getLeetCodeStatsService();
  res.json(stats);
}
