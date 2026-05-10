import { Router } from 'express';
import { getAllBuildings, getBuildingById } from '../data/buildings.js';
import { getReviewsForBuilding, getUserReviewForBuilding } from '../data/reviews.js';
import { getCommentsForBuilding } from '../data/comments.js';
import { getIssuesForBuilding } from '../data/issues.js';
import { isFavorited, getFavoritesForUser } from '../data/favorites.js';

const router = Router();

// GET /buildings
router.get('/', async (req, res) => {
  try {
    const buildings = await getAllBuildings();
    const user = req.session.user || null;
    const userFavorites = user ? await getFavoritesForUser(user._id) : [];
    res.render('pages/buildings', {
      title: 'Browse Rentals — StableStay',
      layout: 'main',
      user,
      buildingsJson: JSON.stringify(buildings),
      favoritesJson: JSON.stringify(userFavorites),
      leaflet: true
    });
  } catch (e) {
    res.status(500).render('pages/error', { title: 'Error', message: e.message, layout: 'main' });
  }
});

// GET /buildings/:id
router.get('/:id', async (req, res) => {
  try {
    const building = await getBuildingById(req.params.id);
    const reviews = await getReviewsForBuilding(req.params.id);
    const comments = await getCommentsForBuilding(req.params.id);
    const issues = await getIssuesForBuilding(req.params.id);

    const user = req.session.user || null;
    let userReview = null;
    let favorited = false;
    if (user) {
      userReview = await getUserReviewForBuilding(req.params.id, user._id);
      favorited = await isFavorited(user._id, req.params.id);
    }

    const formatDate = d => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

    const reviewsForTemplate = reviews.map(r => ({
      ...r,
      stars: '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating),
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
      title: `${building.name} — StableStay`,
      layout: 'main',
      building,
      reviews: reviewsForTemplate,
      comments: commentsForTemplate,
      issues: issuesForTemplate,
      user,
      userReview,
      favorited,
      hasViolations: building.violations && building.violations.length > 0,
      buildingJson: JSON.stringify(building)
    });
  } catch (e) {
    res.status(404).render('pages/error', { title: 'Not Found', message: e.message, layout: 'main' });
  }
});

export default router;
