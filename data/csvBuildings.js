import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const CSV_PATH = join(__dir, 'NYC_DHCR_2024_Rent_Stabilized_Buildings.csv');

const BOROUGH_PRICE = {
  'MANHATTAN':     [2800, 5500],
  'BROOKLYN':      [1900, 3800],
  'QUEENS':        [1700, 3000],
  'BRONX':         [1300, 2400],
  'STATEN ISLAND': [1300, 2200]
};

// Approximate centroids for every NYC zip code in the DHCR dataset
const ZIP_COORDS = {
  // Manhattan
  '10001':[40.7484,-73.9967],'10002':[40.7157,-73.9863],'10003':[40.7317,-73.9892],
  '10004':[40.6998,-74.0401],'10005':[40.7074,-74.0094],'10006':[40.7090,-74.0128],
  '10007':[40.7135,-74.0077],'10009':[40.7258,-73.9776],'10010':[40.7396,-73.9840],
  '10011':[40.7445,-74.0001],'10012':[40.7257,-73.9981],'10013':[40.7195,-74.0047],
  '10014':[40.7331,-74.0046],'10016':[40.7460,-73.9782],'10017':[40.7526,-73.9747],
  '10018':[40.7556,-73.9939],'10019':[40.7659,-73.9866],'10021':[40.7724,-73.9565],
  '10022':[40.7584,-73.9663],'10023':[40.7750,-73.9813],'10024':[40.7837,-73.9763],
  '10025':[40.7966,-73.9679],'10026':[40.8019,-73.9535],'10027':[40.8116,-73.9522],
  '10028':[40.7766,-73.9502],'10029':[40.7916,-73.9449],'10030':[40.8188,-73.9432],
  '10031':[40.8248,-73.9491],'10032':[40.8393,-73.9414],'10033':[40.8508,-73.9332],
  '10034':[40.8653,-73.9251],'10035':[40.7986,-73.9363],'10036':[40.7593,-73.9907],
  '10037':[40.8147,-73.9394],'10038':[40.7087,-74.0034],'10039':[40.8250,-73.9393],
  '10040':[40.8585,-73.9311],'10044':[40.7616,-73.9499],'10065':[40.7640,-73.9645],
  '10069':[40.7763,-73.9882],'10075':[40.7735,-73.9570],'10128':[40.7803,-73.9498],
  '10162':[40.7740,-73.9511],'10280':[40.7091,-74.0155],'10282':[40.7161,-74.0161],
  // Staten Island
  '10301':[40.6279,-74.0945],'10302':[40.6283,-74.1340],'10303':[40.6341,-74.1605],
  '10304':[40.6088,-74.0893],'10305':[40.5968,-74.0763],'10306':[40.5684,-74.1143],
  '10307':[40.5104,-74.2224],'10308':[40.5527,-74.1524],'10309':[40.5446,-74.1948],
  '10310':[40.6353,-74.1167],'10314':[40.6017,-74.1632],
  // Bronx
  '10451':[40.8157,-73.9229],'10452':[40.8327,-73.9173],'10453':[40.8500,-73.9127],
  '10454':[40.8066,-73.9145],'10455':[40.8157,-73.9099],'10456':[40.8268,-73.9074],
  '10457':[40.8445,-73.9010],'10458':[40.8618,-73.8890],'10459':[40.8210,-73.8986],
  '10460':[40.8374,-73.8870],'10461':[40.8432,-73.8448],'10462':[40.8472,-73.8629],
  '10463':[40.8796,-73.9060],'10464':[40.8539,-73.7893],'10465':[40.8294,-73.8275],
  '10466':[40.8937,-73.8454],'10467':[40.8786,-73.8721],'10468':[40.8683,-73.8982],
  '10469':[40.8692,-73.8569],'10470':[40.8964,-73.8700],'10471':[40.9038,-73.9135],
  '10472':[40.8303,-73.8640],'10473':[40.8196,-73.8540],'10474':[40.8119,-73.8827],
  '10475':[40.8788,-73.8280],
  // Brooklyn
  '11201':[40.6932,-73.9907],'11203':[40.6468,-73.9367],'11204':[40.6191,-73.9859],
  '11205':[40.6940,-73.9682],'11206':[40.7025,-73.9413],'11207':[40.6697,-73.8900],
  '11208':[40.6600,-73.8681],'11209':[40.6225,-74.0307],'11210':[40.6330,-73.9446],
  '11211':[40.7147,-73.9504],'11212':[40.6594,-73.9121],'11213':[40.6700,-73.9357],
  '11214':[40.6013,-74.0045],'11215':[40.6597,-73.9866],'11216':[40.6805,-73.9490],
  '11217':[40.6813,-73.9792],'11218':[40.6448,-73.9756],'11219':[40.6316,-73.9963],
  '11220':[40.6390,-74.0156],'11221':[40.6914,-73.9254],'11222':[40.7274,-73.9425],
  '11223':[40.5968,-73.9728],'11224':[40.5768,-73.9909],'11225':[40.6608,-73.9528],
  '11226':[40.6439,-73.9563],'11228':[40.6162,-74.0154],'11229':[40.6013,-73.9468],
  '11230':[40.6207,-73.9589],'11231':[40.6761,-74.0005],'11232':[40.6575,-74.0009],
  '11233':[40.6733,-73.9183],'11234':[40.6150,-73.9245],'11235':[40.5777,-73.9468],
  '11236':[40.6299,-73.9015],'11237':[40.7039,-73.9237],'11238':[40.6780,-73.9637],
  '11239':[40.6461,-73.8803],'11249':[40.7143,-73.9621],'11256':[40.7013,-73.9401],
  // Queens
  '11001':[40.7220,-73.7072],'11004':[40.7461,-73.7089],'11005':[40.7594,-73.7108],
  '11101':[40.7480,-73.9377],'11102':[40.7716,-73.9316],'11103':[40.7644,-73.9222],
  '11104':[40.7453,-73.9229],'11105':[40.7753,-73.9058],'11106':[40.7591,-73.9292],
  '11354':[40.7696,-73.8333],'11355':[40.7514,-73.8297],'11356':[40.7796,-73.8422],
  '11357':[40.7907,-73.8137],'11358':[40.7591,-73.8031],'11360':[40.7791,-73.7815],
  '11361':[40.7632,-73.7732],'11362':[40.7583,-73.7354],'11363':[40.7730,-73.7437],
  '11364':[40.7440,-73.7575],'11365':[40.7376,-73.7961],'11366':[40.7293,-73.7924],
  '11367':[40.7266,-73.8331],'11368':[40.7469,-73.8620],'11369':[40.7622,-73.8742],
  '11370':[40.7728,-73.8822],'11372':[40.7488,-73.8880],'11373':[40.7380,-73.8797],
  '11374':[40.7295,-73.8634],'11375':[40.7213,-73.8468],'11377':[40.7444,-73.9067],
  '11378':[40.7231,-73.9091],'11379':[40.7178,-73.8732],'11385':[40.7012,-73.8872],
  '11411':[40.6950,-73.7442],'11412':[40.6980,-73.7608],'11413':[40.6658,-73.7569],
  '11414':[40.6579,-73.8450],'11415':[40.7101,-73.8303],'11416':[40.6901,-73.8484],
  '11417':[40.6793,-73.8428],'11418':[40.6980,-73.8269],'11419':[40.6885,-73.8175],
  '11420':[40.6734,-73.8133],'11421':[40.6974,-73.8552],'11422':[40.6615,-73.7423],
  '11423':[40.7160,-73.7614],'11426':[40.7365,-73.7177],'11427':[40.7261,-73.7427],
  '11428':[40.7211,-73.7331],'11429':[40.7093,-73.7367],'11432':[40.7184,-73.7915],
  '11433':[40.6969,-73.7938],'11434':[40.6715,-73.7773],'11435':[40.7011,-73.8093],
  '11436':[40.6778,-73.7935],'11691':[40.5988,-73.7571],'11692':[40.5905,-73.7769],
  '11693':[40.5918,-73.8042],'11694':[40.5780,-73.8476]
};

// Borough fallback centroids
const BOROUGH_COORDS = {
  'MANHATTAN':     [40.7831, -73.9712],
  'BROOKLYN':      [40.6501, -73.9496],
  'QUEENS':        [40.7282, -73.7949],
  'BRONX':         [40.8448, -73.8648],
  'STATEN ISLAND': [40.5795, -74.1502]
};

const ALL_AMENITIES = ['Gym', 'Parking', 'Laundry', 'Doorman', 'Rooftop', 'Pet Friendly'];

const VIOLATION_TEMPLATES = [
  { code: 'HMC §27-2017', description: 'Mice/rats infestation in common area',     severity: 'Serious'   },
  { code: 'HMC §27-2013', description: 'Peeling paint in stairwell',                severity: 'Minor'     },
  { code: 'HMC §27-2029', description: 'Inadequate heat in multiple units',         severity: 'Hazardous' },
  { code: 'HMC §27-2013', description: 'Defective floor tiles in hallway',          severity: 'Minor'     },
  { code: 'HMC §27-2005', description: 'Missing smoke detector in Unit 3A',         severity: 'Hazardous' },
  { code: 'HMC §27-2013', description: 'Water damage to ceiling in lobby',          severity: 'Serious'   },
  { code: 'HMC §27-2017', description: 'Cockroach infestation in basement',         severity: 'Serious'   },
  { code: 'HMC §27-2005', description: 'Broken intercom/door lock system',         severity: 'Minor'     },
  { code: 'HMC §27-2029', description: 'No hot water in building for multiple days',severity: 'Hazardous' },
  { code: 'HMC §27-2013', description: 'Cracked plaster in unit walls',            severity: 'Minor'     },
  { code: 'HMC §27-2013', description: 'Leaking roof causing ceiling damage',       severity: 'Serious'   },
  { code: 'HMC §27-2005', description: 'Elevator inspection certificate expired',   severity: 'Minor'     },
];

// Violation count distribution: 30% none, 30% one, 20% two, 20% three
const VCOUNT_MAP = [0, 0, 0, 1, 1, 1, 2, 2, 3, 3];

function toTitle(s) {
  return (s || '').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

// Deterministic value derived from row index — avoids true randomness so IDs stay stable
function det(i, range) {
  return ((i * 2654435761) >>> 0) % range;
}

// Small deterministic jitter so buildings in the same zip aren't stacked
function jitter(i) {
  return (det(i, 1000) - 500) / 100000;
}

let _list      = null;
let _map       = null;
let _byBorough = null;

function load() {
  if (_list) return;

  const lines = readFileSync(CSV_PATH, 'utf8').split(/\r?\n/);
  _list      = [];
  _map       = new Map();
  _byBorough = {};

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const c = line.split(',');
    if (c.length < 15) continue;

    const borough = (c[0] || '').trim();
    const zip     = (c[1] || '').trim();
    const bldgNo  = (c[2] || '').trim();
    const street  = (c[3] || '').trim();
    const suffix  = (c[4] || '').trim();
    const city    = (c[8] || '').trim();
    const block   = (c[13] || '').trim();
    const lot     = (c[14] || '').trim();

    if (!bldgNo || !street) continue;

    const address = [bldgNo, street, suffix].filter(Boolean).join(' ');
    const [lo, hi] = BOROUGH_PRICE[borough.toUpperCase()] || [1600, 3000];
    const price      = lo + det(i, hi - lo);
    const beds       = det(i * 3, 3) + 1;
    const baths      = beds > 2 ? 2 : 1;
    const sqft       = 400 + beds * 150 + det(i * 7, 400);
    const trustScore = 55 + det(i * 11, 40);

    const coords = ZIP_COORDS[zip] || BOROUGH_COORDS[borough.toUpperCase()] || [40.7128, -74.0060];
    const lat = coords[0] + jitter(i);
    const lng = coords[1] + jitter(i * 7);

    // Generate deterministic violations
    const vCount = VCOUNT_MAP[det(i * 41, 10)];
    const violations = [];
    for (let v = 0; v < vCount; v++) {
      const tmpl     = VIOLATION_TEMPLATES[det(i * (43 + v * 7), VIOLATION_TEMPLATES.length)];
      const daysAgo  = det(i * (47 + v * 11), 730);
      const d        = new Date('2025-01-01');
      d.setDate(d.getDate() - daysAgo);
      violations.push({
        code:        tmpl.code,
        description: tmpl.description,
        severity:    tmpl.severity,
        status:      daysAgo < 120 ? 'Open' : 'Closed',
        date:        d.toISOString().split('T')[0]
      });
    }

    // Assign amenities with realistic probabilities using deterministic seeds
    const amenities = [];
    if (det(i * 17, 10) < 4) { amenities.push('Gym'); }           // ~40%
    if (det(i * 19, 10) < 5) { amenities.push('Parking'); }       // ~50%
    if (det(i * 23, 10) < 6) { amenities.push('Laundry'); }       // ~60%
    if (det(i * 29, 10) < 2) { amenities.push('Doorman'); }       // ~20%
    if (det(i * 31, 10) < 1) { amenities.push('Rooftop'); }       // ~10%
    if (det(i * 37, 10) < 4) { amenities.push('Pet Friendly'); }  // ~40%

    const id = String(i);
    const building = {
      _id:           id,
      name:          toTitle(address),
      address:       toTitle(address),
      city:          toTitle(city || borough),
      state:         'NY',
      zip,
      borough:       toTitle(borough),
      block,
      lot,
      price,
      beds,
      baths,
      sqft,
      rentStabilized: true,
      trustScore,
      violationCount: violations.length,
      avgRating:      0,
      amenities,
      violations,
      badge:          null,
      lat,
      lng
    };

    _list.push(building);
    _map.set(id, building);

    const key = borough.toUpperCase();
    if (!_byBorough[key]) _byBorough[key] = [];
    _byBorough[key].push(building);
  }
}

const PAGE = 500;

export function getCsvBuildings(page = 1) {
  load();

  // Round-robin across boroughs so every borough appears on every page
  const buckets   = Object.values(_byBorough);
  const perBucket = Math.ceil(PAGE / buckets.length);
  const offset    = (page - 1) * perBucket;
  const result    = [];

  for (let i = 0; i < perBucket && result.length < PAGE; i++) {
    for (let b = 0; b < buckets.length && result.length < PAGE; b++) {
      const item = buckets[b][offset + i];
      if (item) result.push(item);
    }
  }

  return result;
}

export function searchCsvBuildings(query, limit = 500) {
  load();
  const q = (query || '').toLowerCase().trim();
  if (!q) return getCsvBuildings();

  const results = [];
  for (let i = 0; i < _list.length && results.length < limit; i++) {
    const b = _list[i];
    if (
      b.city.toLowerCase().includes(q) ||
      b.borough.toLowerCase().includes(q) ||
      b.zip.includes(q) ||
      b.name.toLowerCase().includes(q)
    ) {
      results.push(b);
    }
  }
  return results;
}

export function getCsvBuildingById(id) {
  load();
  const b = _map.get(String(id));
  if (!b) throw new Error('Building not found.');
  return b;
}
