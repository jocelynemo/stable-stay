import { dbConnection } from '../config/mongoConnection.js';
import { ObjectId } from 'mongodb';

async function col() { return (await dbConnection()).collection('reviews'); }

export async function getReviewsForBuilding(buildingId) {
  if (!ObjectId.isValid(buildingId)) {
    throw new Error('Invalid building id.');
  }
  const c = await col();
  const docs = await c.find({ buildingId: buildingId.toString() }).sort({ createdAt: -1 }).toArray();
  const result = [];
  for (let i = 0; i < docs.length; i++) {
    result.push(toPlain(docs[i]));
  }
  return result;
}

export async function getAllReviews() {
  const c = await col();
  const docs = await c.find({}).sort({ createdAt: -1 }).toArray();
  const result = [];
  for (let i = 0; i < docs.length; i++) {
    result.push(toPlain(docs[i]));
  }
  return result;
}

export async function getUserReviewForBuilding(buildingId, userId) {
  const c = await col();
  const r = await c.findOne({ buildingId: buildingId.toString(), userId: userId.toString() });
  if (!r) {
    return null;
  }
  return toPlain(r);
}

export async function addReview(buildingId, userId, displayName, rating, text) {
  if (!ObjectId.isValid(buildingId)) {
    throw new Error('Invalid building id.');
  }
  rating = parseInt(rating);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    throw new Error('Rating must be 1-5.');
  }
  if (!text || String(text).trim().length < 5) {
    throw new Error('Review text must be at least 5 characters.');
  }
  if (!displayName || !String(displayName).trim()) {
    throw new Error('Display name is required.');
  }

  const c = await col();
  const existing = await c.findOne({ buildingId: buildingId.toString(), userId: userId.toString() });
  if (existing) {
    throw new Error('You have already reviewed this building.');
  }

  const doc = {
    buildingId: buildingId.toString(),
    userId: userId.toString(),
    displayName: String(displayName).trim(),
    rating,
    text: String(text).trim(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const res = await c.insertOne(doc);
  return { ...doc, _id: res.insertedId.toString() };
}

export async function updateReview(reviewId, userId, rating, text) {
  if (!ObjectId.isValid(reviewId)) {
    throw new Error('Invalid review id.');
  }
  rating = parseInt(rating);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    throw new Error('Rating must be 1-5.');
  }
  if (!text || String(text).trim().length < 5) {
    throw new Error('Review text must be at least 5 characters.');
  }
  const c = await col();
  const rev = await c.findOne({ _id: new ObjectId(reviewId) });
  if (!rev) {
    throw new Error('Review not found.');
  }
  if (rev.userId !== userId.toString()) {
    throw new Error('Not authorized.');
  }
  await c.updateOne({ _id: new ObjectId(reviewId) }, { $set: { rating, text: String(text).trim(), updatedAt: new Date() } });
  return toPlain({ ...rev, rating, text: String(text).trim() });
}

export async function deleteReview(reviewId, userId, isAdmin = false) {
  if (!ObjectId.isValid(reviewId)) {
    throw new Error('Invalid review id.');
  }
  const c = await col();
  const rev = await c.findOne({ _id: new ObjectId(reviewId) });
  if (!rev) {
    throw new Error('Review not found.');
  }
  if (!isAdmin && rev.userId !== userId.toString()) {
    throw new Error('Not authorized.');
  }
  await c.deleteOne({ _id: new ObjectId(reviewId) });
  return rev.buildingId;
}

function toPlain(r) { return { ...r, _id: r._id.toString() }; }
