import {Router} from 'express';

const router = Router();

router.get(['/', '/admin.html'], async (req, res) => {
  return res.render('pages/admin-dashboard', {title: 'Admin Dashboard — StableStay'});
});

export default router;
