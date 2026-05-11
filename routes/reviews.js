import { Router } from 'express';
import { addReview, updateReview, deleteReview, getReviewsForBuilding } from '../data/reviews.js';
import { recomputeTrustScore } from '../data/buildings.js';

const router = Router();

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ success: false, error: 'You must be logged in.' });
  }
  next();
}

// POST /reviews/:buildingId - submit a new review
router.post('/:buildingId', requireAuth, async (req, res) => {
  try {
    const user = req.session.user;
    const displayName = user.firstName + ' ' + user.lastName;
    const { rating, text } = req.body;

    const review = await addReview(req.params.buildingId, user._id, displayName, rating, text);

    const reviews = await getReviewsForBuilding(req.params.buildingId);
    await recomputeTrustScore(req.params.buildingId, reviews);

    res.json({ success: true, review });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// PUT /reviews/:reviewId - edit own review
router.put('/:reviewId', requireAuth, async (req, res) => {
  try {
    const { rating, text } = req.body;
    const review = await updateReview(req.params.reviewId, req.session.user._id, rating, text);

    const reviews = await getReviewsForBuilding(review.buildingId);
    await recomputeTrustScore(review.buildingId, reviews);

    res.json({ success: true, review });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// DELETE /reviews/:reviewId - delete own review or admin
router.delete('/:reviewId', requireAuth, async (req, res) => {
  try {
    const user = req.session.user;
    const buildingId = await deleteReview(req.params.reviewId, user._id, user.isAdmin);

    const reviews = await getReviewsForBuilding(buildingId);
    await recomputeTrustScore(buildingId, reviews);

    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

export default router;
