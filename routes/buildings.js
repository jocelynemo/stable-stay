import {Router} from 'express';

const router = Router();

router.get(['/', '/buildings.html'], async (req, res) => {
  return res.render('pages/buildings', {
    title: 'Browse Rentals — StableStay',
    leafletCss: true
  });
});

router.get(['/building', '/building.html'], async (req, res) => {
  return res.render('pages/building', {title: 'Building Detail — StableStay'});
});

export default router;
