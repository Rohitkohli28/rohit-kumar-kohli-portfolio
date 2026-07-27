import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Rohit Portfolio Backend',
    time: new Date().toISOString()
  });
});

export default router;
