import {Router} from 'express';

const router = Router();

router.get('/index.html', async (req, res) => {
  return res.redirect('/');
});

router.get('/signin', async (req, res) => {
  return res.redirect('/');
});

router.get('/register', async (req, res) => {
  return res.redirect('/');
});

router.get('/signout', async (req, res) => {
  return res.redirect('/');
});

export default router;
