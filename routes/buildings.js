import { Router } from 'express';
import { getReviewsForBuilding, getUserReviewForBuilding } from '../data/reviews.js';
import { getCommentsForBuilding } from '../data/comments.js';
import { getIssuesForBuilding } from '../data/issues.js';
import { isFavorited, getFavoritesForUser } from '../data/favorites.js';
import { getCsvBuildings, searchCsvBuildings, getCsvBuildingById } from '../data/csvBuildings.js';

const router = Router();

// GET /buildings
router.get('/', async (req, res) => {
  const user = req.session.user || null;
  const search = (req.query.search || '').trim();
  const page = parseInt(req.query.page) || 1;
  let buildings;
  if (search) {
    buildings = searchCsvBuildings(search);
  } else {
    buildings = getCsvBuildings(page);
  }
  let favoriteIds = [];

  try {
    const userFavorites = user ? await getFavoritesForUser(user._id) : [];
    for (let i = 0; i < userFavorites.length; i++) {
      const b = userFavorites[i];
      favoriteIds.push(b._id ? b._id.toString() : String(b.id));
    }
  } catch (_) {}

  res.render('pages/buildings', {
    title: 'Browse Rentals - StableStay',
    layout: 'main',
    user,
    buildingsJson: JSON.stringify(buildings),
    favoritesJson: JSON.stringify(favoriteIds),
    leaflet: true
  });
});

// GET /buildings/:id
router.get('/:id', async (req, res) => {
  try {
    const building = getCsvBuildingById(req.params.id);

    const user = req.session.user || null;
    let reviews = [], comments = [], issues = [], userReview = null, favorited = false;

    try { reviews  = await getReviewsForBuilding(req.params.id); }  catch (_) {}
    try { comments = await getCommentsForBuilding(req.params.id); } catch (_) {}
    try { issues   = await getIssuesForBuilding(req.params.id); }   catch (_) {}

    if (user) {
      try { userReview = await getUserReviewForBuilding(req.params.id, user._id); } catch (_) {}
      try { favorited  = await isFavorited(user._id, req.params.id); }             catch (_) {}
    }

    function formatDate(d) {
      if (!d) {
        return '';
      }
      return new Date(d).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }

    const reviewsForTemplate = reviews.map(r => ({
      ...r,
      stars: '\u2605'.repeat(r.rating) + '\u2606'.repeat(5 - r.rating),
      dateFormatted: formatDate(r.createdAt),
      isOwner: user && r.userId === user._id
    }));

    const commentsForTemplate = comments.map(c => ({
      ...c,
      dateFormatted: formatDate(c.createdAt),
      isOwner: user && c.userId === user._id
    }));

    const issuesForTemplate = issues.map(i => ({
      ...i,
      dateFormatted: formatDate(i.createdAt),
      isOwner: user && i.userId === user._id
    }));

    res.render('pages/building', {
      title: `${building.name} - StableStay`,
      layout: 'main',
      leaflet: true,
      building,
      reviews: reviewsForTemplate,
      comments: commentsForTemplate,
      issues: issuesForTemplate,
      user,
      userReview,
      favorited,
      hasViolations: building.violations && building.violations.length > 0,
      buildingJson: JSON.stringify(building),
      reviewsJson: JSON.stringify(reviewsForTemplate),
      commentsJson: JSON.stringify(commentsForTemplate),
      issuesJson: JSON.stringify(issuesForTemplate),
      userReviewJson: JSON.stringify(userReview),
      sessionUserJson: JSON.stringify(user)
    });
  } catch (e) {
    res.status(404).render('pages/error', {
      title: 'Not Found',
      message: e.message,
      layout: 'main'
    });
  }
});

export default router;
