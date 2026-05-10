import { Router } from 'express';
import { getUserById, updateUser, changePassword } from '../data/users.js';
import { getFavoritesForUser } from '../data/favorites.js';

const router = Router();

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/');
  }
  next();
}

//GET /profile — render profile page with current user data and favorites
router.get(['/', '/profile.html'], requireAuth, async (req, res) => {
  try {
    const user      = await getUserById(req.session.user._id);
    const favorites = await getFavoritesForUser(user._id);
    return res.render('pages/profile', {
      title:         'My Profile — StableStay',
      layout:        'main',
      leaflet:       true,
      user,
      userJson:      JSON.stringify(user),
      favoritesJson: JSON.stringify(favorites)
    });
  } catch (e) {
    return res.status(500).render('pages/error', { title: 'Error', message: e.message, layout: 'main' });
  }
});

//POST /profile/update — save name, phone, city, state, zip
router.post('/update', requireAuth, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, city, state, zip } = req.body;
    const updated = await updateUser(req.session.user._id, { firstName, lastName, email, phone, city, state, zip });

    req.session.user = updated;

    res.json({ success: true, user: updated });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

//POST /profile/change-password
router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'New passwords do not match.' });
    }

    await changePassword(req.session.user._id, currentPassword, newPassword);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

export default router;
