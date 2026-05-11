import { dbConnection } from '../config/mongoConnection.js';
import { ObjectId } from 'mongodb';

const VALID_TYPES = ['Pests', 'Noise', 'Maintenance Neglect', 'Safety Hazard', 'Heating/Cooling', 'Water Damage', 'Other'];

async function col() {
  return (await dbConnection()).collection('issues');
}

export async function getIssuesForBuilding(buildingId) {
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

export async function addIssue(buildingId, userId, displayName, type, description) {
  if (!ObjectId.isValid(buildingId)) {
    throw new Error('Invalid building id.');
  }

  let typeValid = false;
  for (let i = 0; i < VALID_TYPES.length; i++) {
    if (VALID_TYPES[i] === type) {
      typeValid = true;
      break;
    }
  }
  if (!typeValid) {
    throw new Error('Invalid issue type.');
  }

  if (!description || String(description).trim().length < 10) {
    throw new Error('Description must be at least 10 characters.');
  }
  if (!displayName || !String(displayName).trim()) {
    throw new Error('Display name is required.');
  }

  const c = await col();
  const doc = {
    buildingId:  buildingId.toString(),
    userId:      userId.toString(),
    displayName: String(displayName).trim(),
    type,
    description: String(description).trim(),
    createdAt:   new Date()
  };
  const res = await c.insertOne(doc);
  return toPlain({ ...doc, _id: res.insertedId });
}

export async function deleteIssue(issueId, userId, isAdmin = false) {
  if (!ObjectId.isValid(issueId)) {
    throw new Error('Invalid issue id.');
  }
  const c = await col();
  const issue = await c.findOne({ _id: new ObjectId(issueId) });
  if (!issue) {
    throw new Error('Issue not found.');
  }
  if (!isAdmin && issue.userId !== userId.toString()) {
    throw new Error('Not authorized.');
  }
  await c.deleteOne({ _id: new ObjectId(issueId) });
}

export async function getAllIssues() {
  const c = await col();
  const docs = await c.find({}).sort({ createdAt: -1 }).toArray();
  const result = [];
  for (let i = 0; i < docs.length; i++) {
    result.push(toPlain(docs[i]));
  }
  return result;
}

function toPlain(doc) {
  return { ...doc, _id: doc._id.toString() };
}
