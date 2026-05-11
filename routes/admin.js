import { Router } from 'express';
import {
  getAllBuildings,
  addBuilding,
  removeBuilding,
  addViolationToBuilding,
  updateViolationInBuilding,
  deleteViolationFromBuilding
} from '../data/buildings.js';
import { getAllUsers, deleteUser } from '../data/users.js';
import { getAllComments, deleteComment } from '../data/comments.js';
import { getAllReviews, deleteReview } from '../data/reviews.js';
import { getAllIssues, deleteIssue } from '../data/issues.js';

const router = Router();

function requireAdmin(req, res, next) {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).render('pages/error', {
      title:   'Forbidden — StableStay',
      message: 'Admin access only.',
      layout:  'main'
    });
  }
  next();
}

function requireAdminJson(req, res, next) {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).json({ success: false, error: 'Admin access only.' });
  }
  next();
}

//GET /admin — render dashboard
router.get(['/', '/admin.html'], requireAdmin, async (req, res) => {
  try {
    const buildings = await getAllBuildings();
    const users     = await getAllUsers();
    const reviews   = await getAllReviews();
    const comments  = await getAllComments();
    const issues    = await getAllIssues();

    const allViolations = [];
    for (let i = 0; i < buildings.length; i++) {
      const b    = buildings[i];
      const viols = b.violations || [];
      for (let j = 0; j < viols.length; j++) {
        allViolations.push({
          vId:          viols[j].vId        || '',
          buildingId:   b._id,
          buildingName: b.name,
          date:         viols[j].date        || '',
          code:         viols[j].code        || '',
          description:  viols[j].description || '',
          severity:     viols[j].severity    || '',
          status:       viols[j].status      || ''
        });
      }
    }

    return res.render('pages/admin-dashboard', {
      title:           'Admin Dashboard — StableStay',
      layout:          'main',
      user:            req.session.user,
      buildingsJson:   JSON.stringify(buildings),
      usersJson:       JSON.stringify(users),
      reviewsJson:     JSON.stringify(reviews),
      commentsJson:    JSON.stringify(comments),
      issuesJson:      JSON.stringify(issues),
      violationsJson:  JSON.stringify(allViolations)
    });
  } catch (e) {
    return res.status(500).render('pages/error', { title: 'Error', message: e.message, layout: 'main' });
  }
});

//POST /admin/buildings — add a building
router.post('/buildings', requireAdminJson, async (req, res) => {
  try {
    const building = await addBuilding(req.body);
    res.json({ success: true, building });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

//DELETE /admin/buildings/:id
router.delete('/buildings/:id', requireAdminJson, async (req, res) => {
  try {
    await removeBuilding(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

//DELETE /admin/reviews/:id
router.delete('/reviews/:id', requireAdminJson, async (req, res) => {
  try {
    await deleteReview(req.params.id, null, true);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

//DELETE /admin/comments/:id
router.delete('/comments/:id', requireAdminJson, async (req, res) => {
  try {
    await deleteComment(req.params.id, null, true);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

//DELETE /admin/users/:id
router.delete('/users/:id', requireAdminJson, async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

//POST /admin/violations/:buildingId — add violation to a building
router.post('/violations/:buildingId', requireAdminJson, async (req, res) => {
  try {
    const violation = await addViolationToBuilding(req.params.buildingId, req.body);
    res.json({ success: true, violation });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

//PATCH /admin/violations/:buildingId/:vId — update violation status
router.post('/violations/:buildingId/:vId/status', requireAdminJson, async (req, res) => {
  try {
    const { status } = req.body;
    await updateViolationInBuilding(req.params.buildingId, req.params.vId, status);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

//DELETE /admin/violations/:buildingId/:vId — remove a violation
router.delete('/violations/:buildingId/:vId', requireAdminJson, async (req, res) => {
  try {
    await deleteViolationFromBuilding(req.params.buildingId, req.params.vId);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

//DELETE /admin/issues/:id — remove a user-reported issue
router.delete('/issues/:id', requireAdminJson, async (req, res) => {
  try {
    await deleteIssue(req.params.id, null, true);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

export default router;
