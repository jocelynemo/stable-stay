import { dbConnection } from '../config/mongoConnection.js';
import { ObjectId } from 'mongodb';
import { getBuildingById } from './buildings.js';

async function col() {
  return (await dbConnection()).collection('comments');
}

function toPlain(doc) {
  if (!doc) return null;
  return { ...doc, _id: doc._id.toString() };
}

export async function getCommentsForBuilding(buildingId) {
  const c = await col();
  const rows = await c.find({ buildingId }).sort({ createdAt: -1 }).toArray();
  return rows.map(toPlain);
}

export async function addComment(buildingId, user, text) {
  await getBuildingById(buildingId);
  const body = String(text || '').trim();
  if (!body.length) throw new Error('Comment cannot be empty.');

  const displayName = `${user.firstName} ${String(user.lastName).charAt(0)}.`;
  const c = await col();
  const res = await c.insertOne({
    buildingId,
    userId: user._id,
    displayName,
    text: body,
    createdAt: new Date()
  });
  return toPlain(await c.findOne({ _id: res.insertedId }));
}

export async function deleteComment(commentId, userId, isAdmin) {
  if (!ObjectId.isValid(commentId)) throw new Error('Invalid comment id.');
  const c = await col();
  const doc = await c.findOne({ _id: new ObjectId(commentId) });
  if (!doc) throw new Error('Comment not found.');
  if (!isAdmin && doc.userId !== userId) throw new Error('You can only delete your own comments.');
  await c.deleteOne({ _id: doc._id });
}
