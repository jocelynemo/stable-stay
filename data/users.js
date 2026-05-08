import { dbConnection } from '../config/mongoConnection.js';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

async function col() {
  return (await dbConnection()).collection('users');
}

export async function createUser(firstName, lastName, email, password, phone, city, state, zip) {
  firstName = String(firstName || '').trim();
  lastName  = String(lastName  || '').trim();
  email     = String(email     || '').trim().toLowerCase();
  password  = String(password  || '');

  if (firstName.length < 2) throw new Error('First name must be at least 2 characters.');
  if (lastName.length  < 2) throw new Error('Last name must be at least 2 characters.');
  if (!email.includes('@'))  throw new Error('Invalid email address.');
  if (password.length  < 6) throw new Error('Password must be at least 6 characters.');

  const c = await col();
  const existing = await c.findOne({ email });
  if (existing) {
    throw new Error('An account with that email already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const doc = {
    firstName,
    lastName,
    email,
    hashedPassword,
    phone:     phone ? String(phone).trim() : '',
    city:      city  ? String(city).trim()  : '',
    state:     state ? String(state).trim() : '',
    zip:       zip   ? String(zip).trim()   : '',
    isAdmin:   false,
    createdAt: new Date()
  };
  const res = await c.insertOne(doc);
  return toPlain({ ...doc, _id: res.insertedId });
}

export async function loginUser(email, password) {
  email    = String(email    || '').trim().toLowerCase();
  password = String(password || '');

  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const c = await col();
  const user = await c.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const match = await bcrypt.compare(password, user.hashedPassword);
  if (!match) {
    throw new Error('Invalid email or password.');
  }

  return toPlain(user);
}

export async function getUserById(id) {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid user id.');
  }
  const c = await col();
  const user = await c.findOne({ _id: new ObjectId(id) });
  if (!user) {
    throw new Error('User not found.');
  }
  return toPlain(user);
}

export async function updateUser(id, fields) {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid user id.');
  }

  const allowed = ['firstName', 'lastName', 'phone', 'city', 'state', 'zip'];
  const set = {};
  for (let i = 0; i < allowed.length; i++) {
    const key = allowed[i];
    if (fields[key] !== undefined) {
      set[key] = String(fields[key]).trim();
    }
  }

  if (set.firstName !== undefined && set.firstName.length < 2) {
    throw new Error('First name must be at least 2 characters.');
  }
  if (set.lastName !== undefined && set.lastName.length < 2) {
    throw new Error('Last name must be at least 2 characters.');
  }
  if (!Object.keys(set).length) {
    throw new Error('Nothing to update.');
  }

  const c = await col();
  await c.updateOne({ _id: new ObjectId(id) }, { $set: set });
  return getUserById(id);
}

export async function changePassword(id, currentPassword, newPassword) {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid user id.');
  }
  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters.');
  }

  const c = await col();
  const user = await c.findOne({ _id: new ObjectId(id) });
  if (!user) {
    throw new Error('User not found.');
  }

  const match = await bcrypt.compare(currentPassword, user.hashedPassword);
  if (!match) {
    throw new Error('Current password is incorrect.');
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await c.updateOne({ _id: new ObjectId(id) }, { $set: { hashedPassword } });
}

export async function getAllUsers() {
  const c = await col();
  const docs = await c.find({}).sort({ createdAt: -1 }).toArray();
  const result = [];
  for (let i = 0; i < docs.length; i++) {
    result.push(toPlain(docs[i]));
  }
  return result;
}

export async function deleteUser(id) {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid user id.');
  }
  const c = await col();
  const res = await c.deleteOne({ _id: new ObjectId(id) });
  if (!res.deletedCount) {
    throw new Error('User not found.');
  }
}

function toPlain(u) {
  const plain = { ...u, _id: u._id.toString() };
  delete plain.hashedPassword;
  return plain;
}
