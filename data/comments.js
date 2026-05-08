import { dbConnection } from '../config/mongoConnection.js';
import { ObjectId } from 'mongodb';

async function col() { return (await dbConnection()).collection('comments'); }

export async function getCommentsForBuilding(buildingId) {
  if (!ObjectId.isValid(buildingId)) {
    throw new Error('Invalid building id.');
  }
  const c = await col();
  return (await c.find({ buildingId: buildingId.toString() }).sort({ createdAt: 1 }).toArray()).map(toPlain);
}

export async function addComment(buildingId, userId, displayName, text) {
  if (!ObjectId.isValid(buildingId)) {
    throw new Error('Invalid building id.');
  }
  if (!text || String(text).trim().length < 1) {
    throw new Error('Comment cannot be empty.');
  }
  if (String(text).trim().length > 1000) {
    throw new Error('Comment is too long (max 1000 chars).');
  }
  if (!displayName || !String(displayName).trim()) {
    throw new Error('Display name is required.');
  }

  const c = await col();
  const doc = {
    buildingId: buildingId.toString(),
    userId: userId.toString(),
    displayName: String(displayName).trim(),
    text: String(text).trim(),
    createdAt: new Date()
  };
  const res = await c.insertOne(doc);
  return { ...doc, _id: res.insertedId.toString() };
}

export async function deleteComment(commentId, userId, isAdmin = false) {
  if (!ObjectId.isValid(commentId)) {
    throw new Error('Invalid comment id.');
  }
  const c = await col();
  const comment = await c.findOne({ _id: new ObjectId(commentId) });
  if (!comment) {
    throw new Error('Comment not found.');
  }
  if (!isAdmin && comment.userId !== userId.toString()) {
    throw new Error('Not authorized.');
  }
  await c.deleteOne({ _id: new ObjectId(commentId) });
}

export async function getAllComments() {
  const c = await col();
  return (await c.find({}).sort({ createdAt: -1 }).toArray()).map(toPlain);
}

function toPlain(c) { return { ...c, _id: c._id.toString() }; }