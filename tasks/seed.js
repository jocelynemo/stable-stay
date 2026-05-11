import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

const __dirname   = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH    = path.join(__dirname, 'data', 'NYC_DHCR_2024_Rent_Stabilized_Buildings.csv');
const SALT_ROUNDS = 10;
const PER_BOROUGH = 50;

function parseCSV(filePath) {
  const raw   = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split('\n');
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      continue;
    }
    const cols = line.split(',');
    if (cols.length < 15) {
      continue;
    }
    records.push({
      borough: cols[0].trim(),
      zip:     cols[1].trim(),
      bldgno:  cols[2].trim(),
      street:  cols[3].trim(),
      suffix:  cols[4].trim(),
      city:    cols[8].trim(),
      county:  cols[9].trim(),
      status1: cols[10].trim(),
      status2: cols[11].trim(),
      block:   cols[13].trim(),
      lot:     cols[14].trim()
    });
  }

  return records;
}

const BOROUGH_CONFIG = {
  Manhattan:      { priceMin: 2800, priceMax: 5500, lat: 40.7831, lng: -73.9712 },
  Brooklyn:       { priceMin: 1800, priceMax: 3800, lat: 40.6782, lng: -73.9442 },
  Queens:         { priceMin: 1500, priceMax: 3200, lat: 40.7282, lng: -73.7949 },
  Bronx:          { priceMin: 1200, priceMax: 2500, lat: 40.8448, lng: -73.8648 },
  'Staten Island':{ priceMin: 1400, priceMax: 2800, lat: 40.5795, lng: -74.1502 }
};

const AMENITY_POOL   = ['Gym', 'Parking', 'Laundry', 'Doorman', 'Rooftop', 'Pet Friendly'];
const BADGES         = ['New', 'Hot', 'Deal', null, null, null];

const VIOLATION_DESCS = [
  { code: 'HMC §27-2017', text: 'Evidence of mice or rats in public areas',     severity: 'Serious'   },
  { code: 'HMC §27-2029', text: 'Inadequate heat or hot water supply',           severity: 'Hazardous' },
  { code: 'HMC §27-2013', text: 'Defective or peeling paint in public areas',    severity: 'Minor'     },
  { code: 'HMC §27-2011', text: 'Broken or defective entrance door hardware',    severity: 'Minor'     },
  { code: 'HMC §27-2005', text: 'Failure to maintain building in good repair',   severity: 'Serious'   },
  { code: 'HMC §27-2026', text: 'Smoke or carbon monoxide detector defective',   severity: 'Hazardous' },
  { code: 'HMC §27-2018', text: 'Cockroach infestation in one or more units',    severity: 'Serious'   },
  { code: 'HMC §27-2056', text: 'Lead paint hazard in unit with child under 6',  severity: 'Hazardous' }
];

const REVIEW_POOL = [
  { rating: 5, text: 'Great building, very responsive management. Would highly recommend.' },
  { rating: 5, text: 'Love living here. Clean hallways, friendly neighbors, no issues.' },
  { rating: 5, text: 'Best apartment I have rented. Maintenance requests are handled same day.' },
  { rating: 4, text: 'Good value for the area. Rent stabilization is a real plus.' },
  { rating: 4, text: 'Solid building overall. Management could communicate a bit better but no major complaints.' },
  { rating: 4, text: 'Nice apartment, good location. A few minor repairs took longer than expected.' },
  { rating: 3, text: 'Building is okay. Maintenance is slow but they do eventually fix things.' },
  { rating: 3, text: 'Average experience. Nothing outstanding but nothing terrible either.' },
  { rating: 3, text: 'Decent place to live but the common areas could use more attention.' },
  { rating: 2, text: 'Had heating issues last winter and management was slow to respond.' },
  { rating: 2, text: 'Noisy neighbors and thin walls. Management did not take complaints seriously.' },
  { rating: 2, text: 'Several maintenance requests went unaddressed for weeks.' },
  { rating: 1, text: 'Terrible experience. Pests in the building and management ignores complaints.' },
  { rating: 1, text: 'Do not rent here. Broken heat in winter, mold in bathroom, no response from super.' },
  { rating: 4, text: 'Quiet building, great landlord. Water pressure could be better.' },
  { rating: 5, text: 'Spotless lobby, working elevator, and very secure. Highly recommend.' },
  { rating: 3, text: 'Okay for the price. Location is convenient but parking is a nightmare.' },
  { rating: 2, text: 'Rent keeps going up but maintenance quality keeps going down.' },
  { rating: 4, text: 'Good management team, quick to address issues. Building is well kept.' },
  { rating: 1, text: 'Cockroach problem was never fully resolved despite multiple complaints.' }
];

const COMMENT_POOL = [
  'Is there a waiting list for available units?',
  'How close is the nearest subway stop?',
  'Are pets allowed in this building?',
  'What utilities are included in the rent?',
  'Is there on-site laundry or do residents use a laundromat?',
  'How is the cell service and internet connectivity here?',
  'Is there a super on site or is maintenance called in?',
  'Are there any available parking spots?',
  'How long is the typical lease term?',
  'Is the building quiet at night?',
  'Are there any move-in fees or deposits beyond first and last month?',
  'How is the noise level from street traffic?'
];

const ISSUE_DESCRIPTIONS = [
  { type: 'Pests',              text: 'Saw mice in the basement hallway near the mailboxes on multiple occasions.' },
  { type: 'Pests',              text: 'Cockroach infestation in Unit 3B has been going on for three weeks with no exterminator visit.' },
  { type: 'Noise',              text: 'Loud construction starts before 7am every weekday and has been ongoing for two months.' },
  { type: 'Noise',              text: 'Tenant above plays loud music past midnight regularly, management has not addressed it.' },
  { type: 'Maintenance Neglect',text: 'Broken stair railing on the third floor has been reported three times with no repair.' },
  { type: 'Maintenance Neglect',text: 'Elevator has been out of service for six days with no estimated repair date given.' },
  { type: 'Safety Hazard',      text: 'Front entrance door lock is broken and anyone can walk in off the street.' },
  { type: 'Safety Hazard',      text: 'Emergency exit sign in stairwell is not illuminated and the bulb has not been replaced.' },
  { type: 'Heating/Cooling',    text: 'No heat in apartments for two days during cold weather. Management unreachable.' },
  { type: 'Heating/Cooling',    text: 'HVAC unit in common area is making loud grinding noise and not cooling properly.' },
  { type: 'Water Damage',       text: 'Ceiling in Unit 4C is leaking after rain. Reported two weeks ago with no follow-up.' },
  { type: 'Water Damage',       text: 'Visible mold growth near bathroom vent in multiple units on the second floor.' },
  { type: 'Other',              text: 'Package room is unlocked and deliveries have been going missing for several weeks.' }
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min, max, decimals) {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(decimals));
}

function randItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randAmenities() {
  const result = [];
  for (let i = 0; i < AMENITY_POOL.length; i++) {
    if (Math.random() > 0.55) {
      result.push(AMENITY_POOL[i]);
    }
  }
  if (result.length === 0) {
    result.push('Laundry');
  }
  return result;
}

function generateViolations(count) {
  const violations = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const template = randItem(VIOLATION_DESCS);
    const daysAgo  = randInt(30, 730);
    const date     = new Date(now - daysAgo * 86400000);
    const dateStr  = date.toISOString().slice(0, 10);
    let status = 'Closed';
    if (Math.random() > 0.4) {
      status = 'Closed';
    } else {
      status = 'Open';
    }
    violations.push({
      vId:         new ObjectId().toString(),
      date:        dateStr,
      code:        template.code,
      description: template.text,
      severity:    template.severity,
      status:      status
    });
  }

  violations.sort(function(a, b) {
    if (b.date < a.date) {
      return -1;
    }
    return 1;
  });

  return violations;
}

function computeTrustScore(violations, rentStabilized) {
  let score = 100;
  for (let i = 0; i < violations.length; i++) {
    if (violations[i].status === 'Open') {
      score -= 5;
    } else {
      score -= 2;
    }
  }
  if (rentStabilized) {
    score += 5;
  }
  if (score < 0) {
    score = 0;
  }
  if (score > 100) {
    score = 100;
  }
  return score;
}

function buildDocument(record) {
  const cfg = BOROUGH_CONFIG[record.borough] || BOROUGH_CONFIG.Manhattan;

  const address = (record.bldgno + ' ' + record.street + ' ' + record.suffix)
    .replace(/\s+/g, ' ')
    .trim();

  const beds  = randInt(1, 3);
  const baths = beds >= 3 ? 2 : 1;
  const sqft  = beds * 380 + randInt(50, 250);

  const violationCount = randInt(0, 6);
  const violations     = generateViolations(violationCount);
  const trustScore     = computeTrustScore(violations, true);

  return {
    name:           address,
    address,
    city:           record.city || record.borough,
    state:          'NY',
    zip:            record.zip,
    price:          randInt(cfg.priceMin, cfg.priceMax),
    units:          randInt(6, 180),
    beds,
    baths,
    sqft,
    badge:          randItem(BADGES),
    borough:        record.borough,
    block:          record.block,
    lot:            record.lot,
    lat:            randFloat(cfg.lat - 0.05, cfg.lat + 0.05, 4),
    lng:            randFloat(cfg.lng - 0.05, cfg.lng + 0.05, 4),
    rentStabilized: true,
    amenities:      randAmenities(),
    violationCount,
    violations,
    trustScore,
    avgRating:      0,
    createdAt:      new Date()
  };
}

async function seed() {
  console.log('Reading CSV...');
  const allRecords = parseCSV(CSV_PATH);

  const counts   = {};
  const selected = [];

  for (let i = 0; i < allRecords.length; i++) {
    const b = allRecords[i].borough;
    if (!BOROUGH_CONFIG[b]) {
      continue;
    }
    if (!counts[b]) {
      counts[b] = 0;
    }
    if (counts[b] >= PER_BOROUGH) {
      continue;
    }
    selected.push(allRecords[i]);
    counts[b]++;
  }

  console.log('Selected buildings per borough:');
  for (const b in counts) {
    console.log('  ' + b + ': ' + counts[b]);
  }

  const db = await dbConnection();

  const collections = ['users', 'buildings', 'reviews', 'comments', 'favorites', 'issues'];
  for (let i = 0; i < collections.length; i++) {
    await db.collection(collections[i]).deleteMany({});
  }
  console.log('Cleared existing data.');

  // ── Users ──────────────────────────────────────────────────────────────────

  const usersCol  = db.collection('users');
  const adminHash = await bcrypt.hash('admin123',    SALT_ROUNDS);
  const u1Hash    = await bcrypt.hash('password123', SALT_ROUNDS);
  const u2Hash    = await bcrypt.hash('password456', SALT_ROUNDS);
  const u3Hash    = await bcrypt.hash('password789', SALT_ROUNDS);

  const adminRes = await usersCol.insertOne({
    firstName: 'Admin', lastName: 'StableStay',
    email: 'admin@stablestay.com', hashedPassword: adminHash,
    phone: '5555555555', city: 'New York', state: 'NY', zip: '10001',
    isAdmin: true, createdAt: new Date()
  });

  const u1Res = await usersCol.insertOne({
    firstName: 'Alex', lastName: 'Rivera',
    email: 'alex@example.com', hashedPassword: u1Hash,
    phone: '5551234567', city: 'Brooklyn', state: 'NY', zip: '11201',
    isAdmin: false, createdAt: new Date()
  });

  const u2Res = await usersCol.insertOne({
    firstName: 'Jordan', lastName: 'Lee',
    email: 'jordan@example.com', hashedPassword: u2Hash,
    phone: '5557654321', city: 'Manhattan', state: 'NY', zip: '10002',
    isAdmin: false, createdAt: new Date()
  });

  const u3Res = await usersCol.insertOne({
    firstName: 'Morgan', lastName: 'Smith',
    email: 'morgan@example.com', hashedPassword: u3Hash,
    phone: '5559876543', city: 'Queens', state: 'NY', zip: '11354',
    isAdmin: false, createdAt: new Date()
  });

  console.log('Users seeded.');

  // ── Buildings ──────────────────────────────────────────────────────────────

  const bCol = db.collection('buildings');
  const docs = [];
  for (let i = 0; i < selected.length; i++) {
    docs.push(buildDocument(selected[i]));
  }

  const bRes        = await bCol.insertMany(docs);
  const insertedIds = Object.values(bRes.insertedIds);
  console.log('Seeded ' + insertedIds.length + ' buildings from NYC DHCR data.');

  // ── Reviews ────────────────────────────────────────────────────────────────

  const revCol  = db.collection('reviews');
  const userIds = [u1Res.insertedId, u2Res.insertedId, u3Res.insertedId];
  const userNames = ['Alex Rivera', 'Jordan Lee', 'Morgan Smith'];

  let reviewCount = 0;
  for (let i = 0; i < insertedIds.length; i++) {
    const bid        = insertedIds[i];
    const numReviews = randInt(1, 3);
    const usedUsers  = {};

    for (let j = 0; j < numReviews; j++) {
      const uIdx = j % userIds.length;
      const uid  = userIds[uIdx].toString();
      if (usedUsers[uid]) {
        continue;
      }
      usedUsers[uid] = true;

      const pool = REVIEW_POOL[(i + j) % REVIEW_POOL.length];
      await revCol.insertOne({
        buildingId:  bid.toString(),
        userId:      uid,
        displayName: userNames[uIdx],
        rating:      pool.rating,
        text:        pool.text,
        createdAt:   new Date(),
        updatedAt:   new Date()
      });
      reviewCount++;
    }
  }
  console.log('Reviews seeded: ' + reviewCount);

  // ── Comments ───────────────────────────────────────────────────────────────

  const comCol = db.collection('comments');
  let commentCount = 0;
  for (let i = 0; i < insertedIds.length; i++) {
    const bid       = insertedIds[i];
    const numComs   = randInt(0, 2);
    const usedUsers = {};

    for (let j = 0; j < numComs; j++) {
      const uIdx = (i + j) % userIds.length;
      const uid  = userIds[uIdx].toString();
      if (usedUsers[uid]) {
        continue;
      }
      usedUsers[uid] = true;

      const text = COMMENT_POOL[(i + j) % COMMENT_POOL.length];
      await comCol.insertOne({
        buildingId:  bid.toString(),
        userId:      uid,
        displayName: userNames[uIdx],
        text:        text,
        createdAt:   new Date()
      });
      commentCount++;
    }
  }
  console.log('Comments seeded: ' + commentCount);

  // ── Issues ─────────────────────────────────────────────────────────────────

  const issCol = db.collection('issues');
  let issueCount = 0;
  for (let i = 0; i < insertedIds.length; i++) {
    const bid      = insertedIds[i];
    const numIssues = randInt(0, 2);

    for (let j = 0; j < numIssues; j++) {
      const uIdx  = (i + j + 1) % userIds.length;
      const uid   = userIds[uIdx].toString();
      const issue = ISSUE_DESCRIPTIONS[(i + j) % ISSUE_DESCRIPTIONS.length];
      await issCol.insertOne({
        buildingId:  bid.toString(),
        userId:      uid,
        displayName: userNames[uIdx],
        type:        issue.type,
        description: issue.text,
        createdAt:   new Date()
      });
      issueCount++;
    }
  }
  console.log('Issues seeded: ' + issueCount);

  await closeConnection();
  console.log('Done. ' + insertedIds.length + ' buildings, ' + reviewCount + ' reviews, ' + commentCount + ' comments, ' + issueCount + ' issues.');
}

seed().catch(function(err) {
  console.error(err);
  process.exit(1);
});
