/**
 * Seed task — run with: node tasks/seed.js
 * Clears and repopulates the StableStay database with test data.
 */
import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

async function seed() {
  console.log('Seeding database...');
  const db = await dbConnection();

  // Clear all collections
  await db.collection('users').deleteMany({});
  await db.collection('buildings').deleteMany({});
  await db.collection('reviews').deleteMany({});
  await db.collection('comments').deleteMany({});
  await db.collection('favorites').deleteMany({});
  await db.collection('issues').deleteMany({});
  console.log('Cleared existing data.');

  // ── Users ────────────────────────────────────────────────────────────────────
  const usersCol = db.collection('users');
  const adminHash = await bcrypt.hash('admin123', SALT_ROUNDS);
  const userHash  = await bcrypt.hash('password123', SALT_ROUNDS);
  const user2Hash = await bcrypt.hash('password456', SALT_ROUNDS);

  const adminRes = await usersCol.insertOne({
    firstName: 'Admin', lastName: 'StableStay',
    email: 'admin@stablestay.com', hashedPassword: adminHash,
    phone: '5555555555', city: 'Jersey City', state: 'NJ', zip: '07302',
    isAdmin: true, createdAt: new Date()
  });

  const user1Res = await usersCol.insertOne({
    firstName: 'Alex', lastName: 'Rivera',
    email: 'alex@example.com', hashedPassword: userHash,
    phone: '5551234567', city: 'Hoboken', state: 'NJ', zip: '07030',
    isAdmin: false, createdAt: new Date()
  });

  const user2Res = await usersCol.insertOne({
    firstName: 'Jordan', lastName: 'Lee',
    email: 'jordan@example.com', hashedPassword: user2Hash,
    phone: '5557654321', city: 'Jersey City', state: 'NJ', zip: '07302',
    isAdmin: false, createdAt: new Date()
  });

  const user3Res = await usersCol.insertOne({
    firstName: 'Morgan', lastName: 'Smith',
    email: 'morgan@example.com', hashedPassword: userHash,
    phone: '5559876543', city: 'Bayonne', state: 'NJ', zip: '07002',
    isAdmin: false, createdAt: new Date()
  });

  console.log('Users seeded.');

  // ── Buildings ─────────────────────────────────────────────────────────────────
  const bCol = db.collection('buildings');
  const buildings = [
    {
      name: 'The Meridian', address: '142 Exchange Place', city: 'Jersey City', zip: '07302',
      price: 2400, units: 48, beds: 2, baths: 1, sqft: 850, badge: 'New',
      borough: 'Hudson County', block: '1042', lot: '7',
      lat: 40.7178, lng: -74.0431, rentStabilized: true,
      amenities: ['Gym', 'Doorman', 'Pet Friendly'],
      violationCount: 3, trustScore: 84, avgRating: 4.2,
      violations: [
        { date: '2024-11-12', code: 'HMC §27-2017', description: 'Mice/rats infestation in common area', severity: 'Serious', status: 'Open' },
        { date: '2024-08-03', code: 'HMC §27-2013', description: 'Defective floor tiles in hallway', severity: 'Minor', status: 'Closed' },
        { date: '2023-12-20', code: 'HMC §27-2013', description: 'Peeling paint in stairwell', severity: 'Minor', status: 'Closed' }
      ],
      createdAt: new Date()
    },
    {
      name: 'Riverside Lofts', address: '88 River Street', city: 'Hoboken', zip: '07030',
      price: 1800, units: 24, beds: 1, baths: 1, sqft: 620, badge: 'Hot',
      borough: 'Hudson County', block: '203', lot: '12',
      lat: 40.7440, lng: -74.0324, rentStabilized: false,
      amenities: ['Parking', 'Laundry'],
      violationCount: 7, trustScore: 61, avgRating: 3.0,
      violations: [
        { date: '2025-01-08', code: 'HMC §27-2029', description: 'No heat in units during cold weather', severity: 'Hazardous', status: 'Open' },
        { date: '2024-10-15', code: 'HMC §27-2017', description: 'Cockroach infestation in basement', severity: 'Serious', status: 'Open' },
        { date: '2024-07-22', code: 'HMC §27-2013', description: 'Leaking roof causing water damage', severity: 'Serious', status: 'Closed' },
        { date: '2024-05-11', code: 'HMC §27-2011', description: 'Broken elevator', severity: 'Serious', status: 'Closed' }
      ],
      createdAt: new Date()
    },
    {
      name: 'Union Square Apts', address: '500 Summit Ave', city: 'Union City', zip: '07087',
      price: 3100, units: 72, beds: 3, baths: 2, sqft: 1150, badge: null,
      borough: 'Hudson County', block: '302', lot: '5',
      lat: 40.7662, lng: -74.0261, rentStabilized: true,
      amenities: ['Gym', 'Rooftop', 'Doorman', 'Laundry'],
      violationCount: 1, trustScore: 91, avgRating: 4.7,
      violations: [
        { date: '2024-03-14', code: 'HMC §27-2013', description: 'Minor paint chipping in lobby', severity: 'Minor', status: 'Closed' }
      ],
      createdAt: new Date()
    },
    {
      name: 'Harbor View Towers', address: '12 Harbor Blvd', city: 'Weehawken', zip: '07086',
      price: 2900, units: 120, beds: 2, baths: 2, sqft: 980, badge: null,
      borough: 'Hudson County', block: '801', lot: '2',
      lat: 40.7699, lng: -74.0220, rentStabilized: false,
      amenities: ['Gym', 'Parking', 'Doorman', 'Pet Friendly'],
      violationCount: 2, trustScore: 79, avgRating: 3.8,
      violations: [
        { date: '2025-02-01', code: 'HMC §27-2017', description: 'Fruit fly infestation near trash area', severity: 'Minor', status: 'Open' },
        { date: '2024-11-30', code: 'HMC §27-2013', description: 'Cracked sidewalk near entrance', severity: 'Minor', status: 'Closed' }
      ],
      createdAt: new Date()
    },
    {
      name: 'Palisade Commons', address: '900 Palisade Ave', city: 'North Bergen', zip: '07047',
      price: 1600, units: 32, beds: 1, baths: 1, sqft: 570, badge: 'Deal',
      borough: 'Hudson County', block: '405', lot: '18',
      lat: 40.7934, lng: -74.0205, rentStabilized: true,
      amenities: ['Laundry', 'Pet Friendly'],
      violationCount: 0, trustScore: 93, avgRating: 4.5,
      violations: [],
      createdAt: new Date()
    },
    {
      name: 'Exchange Place Suites', address: '30 Montgomery St', city: 'Jersey City', zip: '07311',
      price: 3400, units: 90, beds: 2, baths: 2, sqft: 1050, badge: 'New',
      borough: 'Hudson County', block: '1201', lot: '3',
      lat: 40.7166, lng: -74.0333, rentStabilized: false,
      amenities: ['Gym', 'Rooftop', 'Doorman', 'Parking', 'Pet Friendly'],
      violationCount: 0, trustScore: 88, avgRating: 4.4,
      violations: [],
      createdAt: new Date()
    },
    {
      name: 'Lincoln Park Arms', address: '350 West Side Ave', city: 'Jersey City', zip: '07304',
      price: 2200, units: 56, beds: 2, baths: 1, sqft: 870, badge: null,
      borough: 'Hudson County', block: '602', lot: '9',
      lat: 40.7226, lng: -74.0739, rentStabilized: true,
      amenities: ['Laundry', 'Pet Friendly'],
      violationCount: 4, trustScore: 74, avgRating: 3.5,
      violations: [
        { date: '2025-01-20', code: 'HMC §27-2017', description: 'Rodent droppings in basement', severity: 'Serious', status: 'Open' },
        { date: '2024-09-05', code: 'HMC §27-2013', description: 'Damaged hallway flooring on 3rd floor', severity: 'Minor', status: 'Closed' },
        { date: '2024-06-18', code: 'HMC §27-2029', description: 'Inadequate heat in several units', severity: 'Hazardous', status: 'Closed' },
        { date: '2024-04-02', code: 'HMC §27-2011', description: 'Lobby intercom not working', severity: 'Minor', status: 'Closed' }
      ],
      createdAt: new Date()
    },
    {
      name: 'Bloomfield Flats', address: '122 Broad St', city: 'Bloomfield', zip: '07003',
      price: 1500, units: 18, beds: 1, baths: 1, sqft: 540, badge: null,
      borough: 'Essex County', block: '101', lot: '22',
      lat: 40.8065, lng: -74.1882, rentStabilized: false,
      amenities: ['Laundry'],
      violationCount: 5, trustScore: 58, avgRating: 2.8,
      violations: [
        { date: '2025-03-01', code: 'HMC §27-2029', description: 'Mold in bathroom units on 2nd floor', severity: 'Hazardous', status: 'Open' },
        { date: '2024-12-11', code: 'HMC §27-2017', description: 'Mouse traps found in kitchen area', severity: 'Serious', status: 'Open' },
        { date: '2024-10-30', code: 'HMC §27-2013', description: 'Water damage in ceiling', severity: 'Serious', status: 'Open' }
      ],
      createdAt: new Date()
    },
    {
      name: 'Summit Ridge', address: '700 Avenue C', city: 'Bayonne', zip: '07002',
      price: 2700, units: 64, beds: 3, baths: 2, sqft: 1200, badge: null,
      borough: 'Hudson County', block: '710', lot: '4',
      lat: 40.6688, lng: -74.1144, rentStabilized: true,
      amenities: ['Gym', 'Parking', 'Laundry'],
      violationCount: 1, trustScore: 86, avgRating: 4.3,
      violations: [
        { date: '2024-08-17', code: 'HMC §27-2013', description: 'Cracked tiles in lobby', severity: 'Minor', status: 'Closed' }
      ],
      createdAt: new Date()
    },
    {
      name: 'Metro East', address: '45 Passaic Ave', city: 'Kearny', zip: '07032',
      price: 1950, units: 40, beds: 1, baths: 1, sqft: 680, badge: null,
      borough: 'Hudson County', block: '903', lot: '11',
      lat: 40.7587, lng: -74.1454, rentStabilized: false,
      amenities: ['Parking', 'Laundry'],
      violationCount: 2, trustScore: 77, avgRating: 3.9,
      violations: [
        { date: '2024-11-22', code: 'HMC §27-2013', description: 'Broken mailboxes in lobby', severity: 'Minor', status: 'Open' },
        { date: '2024-07-09', code: 'HMC §27-2017', description: 'Pest sighting near dumpster area', severity: 'Minor', status: 'Closed' }
      ],
      createdAt: new Date()
    }
  ];

  const buildingRes = await bCol.insertMany(buildings);
  const buildingIds = Object.values(buildingRes.insertedIds);
  console.log(`Seeded ${buildingIds.length} buildings.`);

  // ── Reviews ───────────────────────────────────────────────────────────────────
  const revCol = db.collection('reviews');
  await revCol.insertMany([
    { buildingId: buildingIds[0].toString(), userId: user1Res.insertedId.toString(), displayName: 'Alex Rivera', rating: 5, text: 'Great location, doorman is very helpful. Building is well maintained.', createdAt: new Date('2025-03-10'), updatedAt: new Date('2025-03-10') },
    { buildingId: buildingIds[0].toString(), userId: user2Res.insertedId.toString(), displayName: 'Jordan Lee', rating: 4, text: 'Good value for the area. Gym is small but functional.', createdAt: new Date('2025-01-22'), updatedAt: new Date('2025-01-22') },
    { buildingId: buildingIds[0].toString(), userId: user3Res.insertedId.toString(), displayName: 'Morgan Smith', rating: 3, text: 'Had some issues with heat last winter but management responded quickly.', createdAt: new Date('2024-12-05'), updatedAt: new Date('2024-12-05') },
    { buildingId: buildingIds[1].toString(), userId: user1Res.insertedId.toString(), displayName: 'Alex Rivera', rating: 2, text: 'Heat was completely out for two weeks in January. Very unpleasant.', createdAt: new Date('2025-02-01'), updatedAt: new Date('2025-02-01') },
    { buildingId: buildingIds[1].toString(), userId: user2Res.insertedId.toString(), displayName: 'Jordan Lee', rating: 4, text: 'Nice location near the PATH. Management could be more responsive.', createdAt: new Date('2024-11-15'), updatedAt: new Date('2024-11-15') },
    { buildingId: buildingIds[2].toString(), userId: user1Res.insertedId.toString(), displayName: 'Alex Rivera', rating: 5, text: 'Absolutely love this building! Rooftop has amazing views of NYC skyline.', createdAt: new Date('2025-04-02'), updatedAt: new Date('2025-04-02') },
    { buildingId: buildingIds[2].toString(), userId: user3Res.insertedId.toString(), displayName: 'Morgan Smith', rating: 4, text: 'Clean, quiet, and well managed. Highly recommend.', createdAt: new Date('2025-02-18'), updatedAt: new Date('2025-02-18') },
    { buildingId: buildingIds[4].toString(), userId: user2Res.insertedId.toString(), displayName: 'Jordan Lee', rating: 5, text: 'Best deal in North Bergen! No violations and super clean.', createdAt: new Date('2025-03-25'), updatedAt: new Date('2025-03-25') },
    { buildingId: buildingIds[4].toString(), userId: user3Res.insertedId.toString(), displayName: 'Morgan Smith', rating: 4, text: 'Quiet building, great neighbors. Laundry could use more machines.', createdAt: new Date('2025-01-10'), updatedAt: new Date('2025-01-10') }
  ]);
  console.log('Reviews seeded.');

  // ── Comments ──────────────────────────────────────────────────────────────────
  const comCol = db.collection('comments');
  await comCol.insertMany([
    { buildingId: buildingIds[0].toString(), userId: user1Res.insertedId.toString(), displayName: 'Alex Rivera', text: 'Is parking included in the rent?', createdAt: new Date('2025-04-01') },
    { buildingId: buildingIds[0].toString(), userId: adminRes.insertedId.toString(), displayName: 'Admin StableStay', text: 'Parking is available for an additional $150/month.', createdAt: new Date('2025-04-02') },
    { buildingId: buildingIds[1].toString(), userId: user2Res.insertedId.toString(), displayName: 'Jordan Lee', text: 'Does the lease allow short-term rentals (AirBnB)?', createdAt: new Date('2025-03-15') },
    { buildingId: buildingIds[2].toString(), userId: user3Res.insertedId.toString(), displayName: 'Morgan Smith', text: 'What is the pet deposit amount?', createdAt: new Date('2025-04-10') }
  ]);
  console.log('Comments seeded.');

  // ── Issues ────────────────────────────────────────────────────────────────────
  const issueCol = db.collection('issues');
  await issueCol.insertMany([
    { buildingId: buildingIds[0].toString(), userId: user2Res.insertedId.toString(), displayName: 'Jordan Lee', type: 'Noise', description: 'Loud neighbors on weekends past midnight. Management has been notified but nothing has changed.', createdAt: new Date('2025-02-14') },
    { buildingId: buildingIds[1].toString(), userId: user1Res.insertedId.toString(), displayName: 'Alex Rivera', type: 'Heat/Hot Water', description: 'No hot water available on weekday mornings between 6-8am. This has been happening for two months.', createdAt: new Date('2025-01-20') },
    { buildingId: buildingIds[6].toString(), userId: user3Res.insertedId.toString(), displayName: 'Morgan Smith', type: 'Pests', description: 'Saw mice in the laundry room twice this week. Building management said they would address it but have not yet.', createdAt: new Date('2025-03-05') }
  ]);
  console.log('Issues seeded.');

  // ── Favorites ─────────────────────────────────────────────────────────────────
  const favCol = db.collection('favorites');
  await favCol.insertMany([
    { userId: user1Res.insertedId.toString(), buildingId: buildingIds[0].toString(), createdAt: new Date() },
    { userId: user1Res.insertedId.toString(), buildingId: buildingIds[2].toString(), createdAt: new Date() },
    { userId: user2Res.insertedId.toString(), buildingId: buildingIds[4].toString(), createdAt: new Date() },
    { userId: user3Res.insertedId.toString(), buildingId: buildingIds[8].toString(), createdAt: new Date() }
  ]);
  console.log('Favorites seeded.');

  console.log('\n✅ Seeding complete!');
  console.log('\nTest accounts:');
  console.log('  Admin:  admin@stablestay.com  / admin123');
  console.log('  User 1: alex@example.com      / password123');
  console.log('  User 2: jordan@example.com    / password456');
  console.log('  User 3: morgan@example.com    / password123');
  await closeConnection();
}

seed().catch(e => { console.error(e); closeConnection(); process.exit(1); });
