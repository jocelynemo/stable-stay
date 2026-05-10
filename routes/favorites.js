import { Router } from 'express';
import { toggleFavorite } from '../data/favorites.js';

const router = Router();

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ success: false, error: 'You must be logged in.' });
  }
  next();
}

router.post('/toggle', requireAuth, async (req, res) => {
  try {
    const { buildingId } = req.body;
    if (!buildingId) {
      return res.status(400).json({ success: false, error: 'buildingId is required.' });
    }

    const favorited = await toggleFavorite(req.session.user._id, buildingId);
    res.json({ success: true, favorited });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

export default router;
