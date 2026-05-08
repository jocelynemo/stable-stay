import { dbConnection } from '../config/mongoConnection.js';
import { ObjectId } from 'mongodb';

async function col() { return (await dbConnection()).collection('buildings'); }

export async function getAllBuildings() {
  const c = await col();
  return (await c.find({}).toArray()).map(toPlain);
}

export async function getBuildingById(id) {
  if (!ObjectId.isValid(id)) throw new Error('Invalid building id.');
  const c = await col();
  const b = await c.findOne({ _id: new ObjectId(id) });
  if (!b) throw new Error('Building not found.');
  return toPlain(b);
}

export async function addBuilding(data) {
  validateBuilding(data);
  const c = await col();
  const doc = {
    name: data.name.trim(),
    address: (data.address || '').trim(),
    city: data.city.trim(),
    zip: (data.zip || '').trim(),
    price: Number(data.price) || 0,
    units: parseInt(data.units) || 0,
    beds: parseInt(data.beds) || 0,
    baths: parseInt(data.baths) || 0,
    sqft: parseInt(data.sqft) || 0,
    borough: (data.borough || '').trim(),
    block: (data.block || '').trim(),
    lot: (data.lot || '').trim(),
    lat: Number(data.lat) || 0,
    lng: Number(data.lng) || 0,
    badge: data.badge || null,
    rentStabilized: Boolean(data.rentStabilized),
    amenities: Array.isArray(data.amenities) ? data.amenities : [],
    violationCount: parseInt(data.violationCount) || 0,
    trustScore: Number(data.trustScore) || (data.rentStabilized ? 90 : 75),
    avgRating: 0,
    violations: Array.isArray(data.violations) ? data.violations : [],
    createdAt: new Date()
  };
  const res = await c.insertOne(doc);
  return { ...doc, _id: res.insertedId.toString() };
}

export async function updateBuilding(id, data) {
  if (!ObjectId.isValid(id)) throw new Error('Invalid building id.');
  const allowed = ['name','address','city','zip','price','units','beds','baths','sqft',
                   'borough','block','lot','lat','lng','badge','rentStabilized','amenities',
                   'trustScore','violationCount','avgRating','violations'];
  const set = {};
  for (const k of allowed) { if (data[k] !== undefined) set[k] = data[k]; }
  if (!Object.keys(set).length) throw new Error('Nothing to update.');
  const c = await col();
  await c.updateOne({ _id: new ObjectId(id) }, { $set: set });
  return getBuildingById(id);
}

export async function removeBuilding(id) {
  if (!ObjectId.isValid(id)) throw new Error('Invalid building id.');
  const c = await col();
  const res = await c.deleteOne({ _id: new ObjectId(id) });
  if (!res.deletedCount) throw new Error('Building not found.');
}

export async function recomputeTrustScore(buildingId, reviews) {
  const b = await getBuildingById(buildingId);
  let score = 100;
  // violations: -5 per open violation, -2 per closed
  for (const v of (b.violations || [])) {
    score -= v.status === 'Open' ? 5 : 2;
  }
  // rent stabilized bonus
  if (b.rentStabilized) score += 5;
  // review average
  if (reviews.length) {
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    score += Math.round((avg - 3) * 4); // +8 for 5 stars, -8 for 1 star
  }
  score = Math.max(0, Math.min(100, score));
  const avgRating = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : 0;
  await updateBuilding(buildingId, { trustScore: score, avgRating });
}

function validateBuilding(d) {
  if (!d.name || !String(d.name).trim()) throw new Error('Building name is required.');
  if (!d.city || !String(d.city).trim()) throw new Error('City is required.');
  if (d.price !== undefined && (isNaN(Number(d.price)) || Number(d.price) < 0))
    throw new Error('Price must be a non-negative number.');
}

function toPlain(b) { return { ...b, _id: b._id.toString() }; }