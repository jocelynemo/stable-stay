import { Router } from 'express';
import { createUser, loginUser } from '../data/users.js';

const router = Router();

//GET /signin, /register — redirect to landing (modal opens client-side)
router.get('/index.html', async (req, res) => {
  return res.redirect('/');
});

router.get('/signin', async (req, res) => {
  return res.redirect('/');
});

router.get('/register', async (req, res) => {
  return res.redirect('/');
});

//GET /signout — destroy session and redirect home
router.get('/signout', async (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.error('Session destroy error:', err);
    }
    res.redirect('/');
  });
});

function isDbError(e) {
  const msg = e.message || '';
  return msg.includes('ECONNREFUSED') || msg.includes('unavailable') || msg.includes('timed out');
}

//POST /login — AJAX sign-in from auth modal
router.post('/login', async (req, res) => {
  const isAjax = req.headers['x-requested-with'] === 'XMLHttpRequest';
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      if (isAjax) return res.status(400).json({ success: false, error: 'Email and password are required.' });
      return res.redirect('/');
    }

    const user = await loginUser(email, password);
    req.session.user = user;

    if (isAjax) return res.json({ success: true });
    res.redirect('/');
  } catch (e) {
    if (isAjax) return res.status(401).json({ success: false, error: 'Incorrect email or password.' });
    res.redirect('/');
  }
});

//POST /register — AJAX registration from auth modal
router.post('/register', async (req, res) => {
  const isAjax = req.headers['x-requested-with'] === 'XMLHttpRequest';
  try {
    const { firstName, lastName, email, password } = req.body;

    const user = await createUser(firstName, lastName, email, password);
    req.session.user = user;

    if (isAjax) return res.json({ success: true });
    res.redirect('/');
  } catch (e) {
    let msg;
    if (isDbError(e)) {
      msg = 'Registration unavailable. Please try again later.';
    } else {
      msg = e.message;
    }
    if (isAjax) return res.status(400).json({ success: false, error: msg });
    res.redirect('/');
  }
});

export default router;
