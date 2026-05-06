import { Router } from 'express';
import { addReview, updateReview, deleteReview } from '../data/reviews.js';

const router = Router();

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ success: false, error: 'You must be logged in.' });
  }
  next();
}

// POST /reviews/:buildingId
router.post('/:buildingId', requireAuth, async (req, res) => {
  try {
    const { rating, text } = req.body || {};
    const review = await addReview(req.params.buildingId, req.session.user, rating, text);
    res.json({ success: true, review });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// PUT /reviews/:reviewId
router.put('/:reviewId', requireAuth, async (req, res) => {
  try {
    const { rating, text } = req.body || {};
    const u = req.session.user;
    const review = await updateReview(req.params.reviewId, u._id, !!u.isAdmin, rating, text);
    res.json({ success: true, review });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// DELETE /reviews/:reviewId
router.delete('/:reviewId', requireAuth, async (req, res) => {
  try {
    const u = req.session.user;
    await deleteReview(req.params.reviewId, u._id, !!u.isAdmin);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

export default router;
