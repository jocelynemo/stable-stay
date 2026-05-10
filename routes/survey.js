import { Router } from 'express';
import { getAllBuildings } from '../data/buildings.js';

const router = Router();

// GET /survey/results
router.get('/results', async (req, res) => {
  try {
    const { maxPrice, beds, sort } = req.query;
    let buildings = await getAllBuildings();

    if (maxPrice) {
      buildings = buildings.filter(b => b.price <= parseInt(maxPrice));
    }

    if (beds) {
      const bedCount = parseInt(beds);
      buildings = buildings.filter(b => bedCount >= 3 ? b.beds >= 3 : b.beds === bedCount);
    }

    if (sort === 'price') {
      buildings.sort((a, b) => a.price - b.price);
    } else if (sort === 'trust') {
      buildings.sort((a, b) => b.trustScore - a.trustScore);
    } else if (sort === 'amenities') {
      buildings.sort((a, b) => (b.amenities || []).length - (a.amenities || []).length);
    } else if (sort === 'space') {
      buildings.sort((a, b) => b.sqft - a.sqft);
    }

    res.json({ success: true, buildings });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;
