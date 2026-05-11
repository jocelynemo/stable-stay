import { Router } from 'express';
import { addIssue, deleteIssue } from '../data/issues.js';

const router = Router();

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ success: false, error: 'You must be logged in.' });
  }
  next();
}

//POST /issues/:buildingId
router.post('/:buildingId', requireAuth, async (req, res) => {
  try {
    const { type, description } = req.body;
    const user = req.session.user;
    const displayName = `${user.firstName} ${user.lastName}`;
    const issue = await addIssue(req.params.buildingId, user._id, displayName, type, description);
    res.json({ success: true, issue });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

//DELETE /issues/:issueId
router.delete('/:issueId', requireAuth, async (req, res) => {
  try {
    await deleteIssue(req.params.issueId, req.session.user._id, req.session.user.isAdmin);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

export default router;
