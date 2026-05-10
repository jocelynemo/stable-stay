import { dbConnection } from '../config/mongoConnection.js';
import { ObjectId } from 'mongodb';
import { getBuildingById, recomputeTrustScore } from './buildings.js';

async function col() {
  return (await dbConnection()).collection('reviews');
}

function toPlain(doc) {
  if (!doc) return null;
  return { ...doc, _id: doc._id.toString() };
}

export async function getReviewsForBuilding(buildingId) {
  const c = await col();
  const rows = await c.find({ buildingId }).sort({ createdAt: -1 }).toArray();
  return rows.map(toPlain);
}

export async function getUserReviewForBuilding(buildingId, userId) {
  const c = await col();
  const r = await c.findOne({ buildingId, userId });
  return r ? toPlain(r) : null;
}

export async function addReview(buildingId, user, rating, text) {
  await getBuildingById(buildingId);
  const r = parseInt(String(rating), 10);
  if (!Number.isFinite(r) || r < 1 || r > 5) throw new Error('Rating must be between 1 and 5.');
  const body = String(text || '').trim();
  if (body.length < 5) throw new Error('Review must be at least 5 characters.');

  const c = await col();
  const existing = await c.findOne({ buildingId, userId: user._id });
  if (existing) throw new Error('You already reviewed this building. Edit or delete your existing review.');

  const displayName = `${user.firstName} ${String(user.lastName).charAt(0)}.`;
  const now = new Date();
  await c.insertOne({
    buildingId,
    userId: user._id,
    displayName,
    rating: r,
    text: body,
    createdAt: now,
    updatedAt: now
  });

  const reviews = await getReviewsForBuilding(buildingId);
  await recomputeTrustScore(buildingId, reviews);
  return getUserReviewForBuilding(buildingId, user._id);
}

export async function updateReview(reviewId, userId, isAdmin, rating, text) {
  const r = parseInt(String(rating), 10);
  if (!Number.isFinite(r) || r < 1 || r > 5) throw new Error('Rating must be between 1 and 5.');
  const body = String(text || '').trim();
  if (body.length < 5) throw new Error('Review must be at least 5 characters.');
  if (!ObjectId.isValid(reviewId)) throw new Error('Invalid review id.');

  const c = await col();
  const doc = await c.findOne({ _id: new ObjectId(reviewId) });
  if (!doc) throw new Error('Review not found.');
  if (!isAdmin && doc.userId !== userId) throw new Error('You can only edit your own review.');

  const buildingId = doc.buildingId;
  await c.updateOne(
    { _id: doc._id },
    { $set: { rating: r, text: body, updatedAt: new Date() } }
  );

  const reviews = await getReviewsForBuilding(buildingId);
  await recomputeTrustScore(buildingId, reviews);
  return toPlain(await c.findOne({ _id: doc._id }));
}

export async function deleteReview(reviewId, userId, isAdmin) {
  if (!ObjectId.isValid(reviewId)) throw new Error('Invalid review id.');
  const c = await col();
  const doc = await c.findOne({ _id: new ObjectId(reviewId) });
  if (!doc) throw new Error('Review not found.');
  if (!isAdmin && doc.userId !== userId) throw new Error('You can only delete your own review.');

  const buildingId = doc.buildingId;
  await c.deleteOne({ _id: doc._id });
  const reviews = await getReviewsForBuilding(buildingId);
  await recomputeTrustScore(buildingId, reviews);
}
