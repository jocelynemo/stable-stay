import { MongoClient } from 'mongodb';
import { mongoConfig } from './settings.js';

let _db = undefined;
let _connecting = null;

async function connect() {
  // Try real MongoDB first
  try {
    const conn = await MongoClient.connect(mongoConfig.serverUrl, { serverSelectionTimeoutMS: 2000 });
    return conn.db(mongoConfig.database);
  } catch (_) {}

  // Fall back to in-memory MongoDB
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  const mem = await MongoMemoryServer.create();
  const conn = await MongoClient.connect(mem.getUri());
  console.log('Using in-memory MongoDB (data resets on restart)');
  return conn.db(mongoConfig.database);
}

export const dbConnection = async () => {
  if (_db) return _db;
  if (!_connecting) _connecting = connect();
  _db = await _connecting;
  return _db;
};

 