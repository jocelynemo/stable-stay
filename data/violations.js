import { dbConnection } from '../config/mongoConnection.js';
import { ObjectId } from 'mongodb';

async function col() {
  return (await dbConnection()).collection('violations');
}

export async function getViolationsForBuilding(buildingId) {
  if (!ObjectId.isValid(buildingId)) {
    throw new Error('Invalid building id.');
  }
  const c    = await col();
  const docs = await c.find({ buildingId: buildingId.toString() }).sort({ date: -1 }).toArray();
  const result = [];
  for (let i = 0; i < docs.length; i++) {
    result.push(toPlain(docs[i]));
  }
  return result;
}

export async function addViolation(buildingId, data) {
  if (!ObjectId.isValid(buildingId)) {
    throw new Error('Invalid building id.');
  }
  if (!data.code || !String(data.code).trim()) {
    throw new Error('Violation code is required.');
  }
  if (!data.description || !String(data.description).trim()) {
    throw new Error('Description is required.');
  }
  const validSeverities = ['Minor', 'Serious', 'Hazardous'];
  let severityOk = false;
  for (let i = 0; i < validSeverities.length; i++) {
    if (data.severity === validSeverities[i]) {
      severityOk = true;
      break;
    }
  }
  if (!severityOk) {
    throw new Error('Severity must be Minor, Serious, or Hazardous.');
  }
  if (data.status !== 'Open' && data.status !== 'Closed') {
    throw new Error('Status must be Open or Closed.');
  }

  const c   = await col();
  const doc = {
    buildingId:  buildingId.toString(),
    date:        data.date || new Date().toISOString().split('T')[0],
    code:        String(data.code).trim(),
    description: String(data.description).trim(),
    severity:    data.severity,
    status:      data.status,
    createdAt:   new Date()
  };
  const res = await c.insertOne(doc);
  return { ...doc, _id: res.insertedId.toString() };
}

export async function updateViolationStatus(violationId, status) {
  if (!ObjectId.isValid(violationId)) {
    throw new Error('Invalid violation id.');
  }
  if (status !== 'Open' && status !== 'Closed') {
    throw new Error('Status must be Open or Closed.');
  }
  const c   = await col();
  const res = await c.updateOne({ _id: new ObjectId(violationId) }, { $set: { status } });
  if (!res.matchedCount) {
    throw new Error('Violation not found.');
  }
}

export async function deleteViolation(violationId) {
  if (!ObjectId.isValid(violationId)) {
    throw new Error('Invalid violation id.');
  }
  const c   = await col();
  const res = await c.deleteOne({ _id: new ObjectId(violationId) });
  if (!res.deletedCount) {
    throw new Error('Violation not found.');
  }
}

function toPlain(v) {
  return { ...v, _id: v._id.toString() };
}
