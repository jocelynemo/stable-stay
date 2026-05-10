import { dbConnection } from '../config/mongoConnection.js';
import { getBuildingById } from './buildings.js';

async function col() {
  return (await dbConnection()).collection('favorites');
}

export async function toggleFavorite(userId, buildingId) {
  const c = await col();
  const existing = await c.findOne({
    userId:     userId.toString(),
    buildingId: buildingId.toString()
  });

  if (existing) {
    await c.deleteOne({ _id: existing._id });
    return false;
  }

  await c.insertOne({
    userId:     userId.toString(),
    buildingId: buildingId.toString(),
    createdAt:  new Date()
  });
  return true;
}

export async function isFavorited(userId, buildingId) {
  const c = await col();
  const doc = await c.findOne({
    userId:     userId.toString(),
    buildingId: buildingId.toString()
  });
  return doc !== null;
}

export async function getFavoritesForUser(userId) {
  const c = await col();
  const docs = await c.find({ userId: userId.toString() }).sort({ createdAt: -1 }).toArray();
  const result = [];
  for (let i = 0; i < docs.length; i++) {
    try {
      const building = await getBuildingById(docs[i].buildingId);
      result.push(building);
    } catch (e) {
    }
  }
  return result;
}
