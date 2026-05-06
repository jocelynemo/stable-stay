import { Router } from 'express';
import { addComment, deleteComment } from '../data/comments.js';

const router = Router();

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ success: false, error: 'You must be logged in.' });
  }
  next();
}

// POST /comments/:buildingId
router.post('/:buildingId', requireAuth, async (req, res) => {
  try {
    const { text } = req.body || {};
    const comment = await addComment(req.params.buildingId, req.session.user, text);
    res.json({ success: true, comment });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// DELETE /comments/:commentId
router.delete('/:commentId', requireAuth, async (req, res) => {
  try {
    const u = req.session.user;
    await deleteComment(req.params.commentId, u._id, !!u.isAdmin);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

export default router;
