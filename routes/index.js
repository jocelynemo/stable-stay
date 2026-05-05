import auth from './auth.js';
import profile from './profile.js';
import buildings from './buildings.js';
import reviews from './reviews.js';
import comments from './comments.js';
import favorites from './favorites.js';
import admin from './admin.js';
import survey from './survey.js';

const constructorMethod = (app) => {
  app.get('/', async (req, res) => {
    return res.render('pages/landing', {title: 'StableStay'});
  });

  app.use('/', auth);
  app.use('/profile', profile);
  app.use('/buildings', buildings);
  app.use('/reviews', reviews);
  app.use('/comments', comments);
  app.use('/favorites', favorites);
  app.use('/admin', admin);
  app.use('/survey', survey);

  app.use(async (req, res) => {
    return res.status(404).render('pages/error', {title: 'Not Found — StableStay'});
  });
};

export default constructorMethod;
