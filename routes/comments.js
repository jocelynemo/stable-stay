import { Router } from 'express';
import { addComment, deleteComment } from '../data/comments.js';

const router = Router();

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ success: false, error: 'You must be logged in.' });
  }
  next();
}

// POST /comments/:buildingId - post a comment
router.post('/:buildingId', requireAuth, async (req, res) => {
  try {
    const user = req.session.user;
    const displayName = user.firstName + ' ' + user.lastName;
    const { text } = req.body;

    const comment = await addComment(req.params.buildingId, user._id, displayName, text);
    res.json({ success: true, comment });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// DELETE /comments/:commentId - delete own comment or admin
router.delete('/:commentId', requireAuth, async (req, res) => {
  try {
    const user = req.session.user;
    await deleteComment(req.params.commentId, user._id, user.isAdmin);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

export default router;
