import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

async function seedAdmin() {
  const db = await dbConnection();
  const users = db.collection('users');

  const existing = await users.findOne({ email: 'admin@stablestay.com' });
  if (existing) {
    console.log('Admin already exists.');
    await closeConnection();
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
  await users.insertOne({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@stablestay.com',
    hashedPassword,
    phone: '',
    city: '',
    state: 'NJ',
    zip: '',
    isAdmin: true,
    createdAt: new Date()
  });

  console.log('Admin account created.');
  console.log('  Email:    admin@stablestay.com');
  console.log('  Password: admin123');
  await closeConnection();
}

seedAdmin().catch(e => {
  console.error(e);
  closeConnection();
});