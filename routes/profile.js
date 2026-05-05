import {Router} from 'express';

const router = Router();

router.get(['/', '/profile.html'], async (req, res) => {
  return res.render('pages/profile', {title: 'My Profile — StableStay'});
});

export default router;
