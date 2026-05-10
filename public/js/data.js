//data.js: single source of truth for buildings data (loaded before all other scripts)


window.BUILDINGS_STATIC = [
  {
    id: 1, name: "The Meridian", price: 2400, city: "Jersey City", zip: "07302",
    beds: 2, baths: 1, sqft: 850, badge: "New",
    amenities: ["Gym", "Doorman", "Pet Friendly"],
    address: "142 Exchange Place", borough: "Hudson County",
    block: "1042", lot: "7", units: 48, rentStabilized: true,
    violationCount: 3, trustScore: 84, lat: 40.7178, lng: -74.0431,
    violations: [
      { date: "2024-11-12", code: "HMC §27-2017", description: "Mice/rats infestation in common area", severity: "Serious", status: "Open" },
      { date: "2024-08-03", code: "HMC §27-2013", description: "Defective floor tiles in hallway", severity: "Minor", status: "Closed" },
      { date: "2023-12-20", code: "HMC §27-2013", description: "Peeling paint in stairwell", severity: "Minor", status: "Closed" }
    ],
    avgRating: 4.2
  },
  {
    id: 2, name: "Riverside Lofts", price: 1800, city: "Hoboken", zip: "07030",
    beds: 1, baths: 1, sqft: 620, badge: "Hot",
    amenities: ["Parking", "Laundry"],
    address: "88 River Street", borough: "Hudson County",
    block: "203", lot: "12", units: 24, rentStabilized: false,
    violationCount: 7, trustScore: 61, lat: 40.7440, lng: -74.0324,
    violations: [
      { date: "2025-01-08", code: "HMC §27-2029", description: "No heat in units during cold weather", severity: "Hazardous", status: "Open" },
      { date: "2024-10-15", code: "HMC §27-2017", description: "Cockroach infestation in basement", severity: "Serious", status: "Open" },
      { date: "2024-07-22", code: "HMC §27-2013", description: "Leaking roof causing water damage", severity: "Serious", status: "Closed" },
      { date: "2024-05-10", code: "HMC §27-2005", description: "Broken intercom system", severity: "Minor", status: "Closed" }
    ],
    avgRating: 2.8
  },
  {
    id: 3, name: "Union Square Apts", price: 3100, city: "Union City", zip: "07087",
    beds: 3, baths: 2, sqft: 1150, badge: null,
    amenities: ["Gym", "Rooftop", "Pet Friendly"],
    address: "500 Bergenline Ave", borough: "Hudson County",
    block: "3301", lot: "4", units: 72, rentStabilized: true,
    violationCount: 1, trustScore: 91, lat: 40.7671, lng: -74.0287,
    violations: [
      { date: "2024-09-05", code: "HMC §27-2005", description: "Elevator inspection sticker expired", severity: "Minor", status: "Closed" }
    ],
    avgRating: 4.7
  },
  {
    id: 4, name: "Harbor View Towers", price: 2900, city: "Weehawken", zip: "07086",
    beds: 2, baths: 2, sqft: 980, badge: null,
    amenities: ["Doorman", "Parking", "Gym"],
    address: "1600 Harbor Blvd", borough: "Hudson County",
    block: "501", lot: "2", units: 120, rentStabilized: false,
    violationCount: 2, trustScore: 77, lat: 40.7685, lng: -74.0187,
    violations: [
      { date: "2024-12-01", code: "HMC §27-2013", description: "Damaged ceiling tiles in lobby", severity: "Minor", status: "Closed" },
      { date: "2024-06-18", code: "HMC §27-2005", description: "Gym equipment poses safety hazard", severity: "Serious", status: "Closed" }
    ],
    avgRating: 4.0
  },
  {
    id: 5, name: "Palisade Commons", price: 1600, city: "North Bergen", zip: "07047",
    beds: 1, baths: 1, sqft: 570, badge: "Deal",
    amenities: ["Laundry", "Parking"],
    address: "7200 Palisade Ave", borough: "Hudson County",
    block: "2201", lot: "9", units: 36, rentStabilized: true,
    violationCount: 0, trustScore: 95, lat: 40.7932, lng: -74.0347,
    violations: [],
    avgRating: 4.5
  },
  {
    id: 6, name: "Exchange Place Suites", price: 3400, city: "Jersey City", zip: "07311",
    beds: 2, baths: 2, sqft: 1050, badge: "New",
    amenities: ["Gym", "Rooftop", "Doorman", "Pet Friendly"],
    address: "25 Exchange Place", borough: "Hudson County",
    block: "1105", lot: "1", units: 200, rentStabilized: false,
    violationCount: 0, trustScore: 93, lat: 40.7165, lng: -74.0332,
    violations: [],
    avgRating: 4.8
  },
  {
    id: 7, name: "Lincoln Park Arms", price: 2200, city: "Jersey City", zip: "07304",
    beds: 2, baths: 1, sqft: 870, badge: null,
    amenities: ["Laundry", "Pet Friendly"],
    address: "350 Lincoln Park", borough: "Hudson County",
    block: "2410", lot: "3", units: 60, rentStabilized: true,
    violationCount: 4, trustScore: 72, lat: 40.7282, lng: -74.0776,
    violations: [
      { date: "2025-01-20", code: "HMC §27-2017", description: "Rodent droppings found in basement storage", severity: "Serious", status: "Open" },
      { date: "2024-09-11", code: "HMC §27-2013", description: "Water leak from ceiling in Unit 5C", severity: "Serious", status: "Closed" },
      { date: "2024-04-07", code: "HMC §27-2005", description: "Missing smoke detector in Unit 3A", severity: "Hazardous", status: "Closed" },
      { date: "2023-08-15", code: "HMC §27-2013", description: "Paint peeling in stairwell", severity: "Minor", status: "Closed" }
    ],
    avgRating: 3.5
  },
  {
    id: 8, name: "Bloomfield Flats", price: 1500, city: "Bloomfield", zip: "07003",
    beds: 1, baths: 1, sqft: 540, badge: null,
    amenities: ["Laundry"],
    address: "412 Broad Street", borough: "Essex County",
    block: "4102", lot: "15", units: 18, rentStabilized: false,
    violationCount: 2, trustScore: 68, lat: 40.8068, lng: -74.1896,
    violations: [
      { date: "2024-10-20", code: "HMC §27-2029", description: "Inadequate heating in common areas", severity: "Serious", status: "Closed" },
      { date: "2024-03-14", code: "HMC §27-2013", description: "Cracked tiles in bathroom of Unit 2B", severity: "Minor", status: "Closed" }
    ],
    avgRating: 3.2
  },
  {
    id: 9, name: "Summit Ridge", price: 2700, city: "Bayonne", zip: "07002",
    beds: 3, baths: 2, sqft: 1200, badge: null,
    amenities: ["Parking", "Pet Friendly", "Gym"],
    address: "900 Kennedy Blvd", borough: "Hudson County",
    block: "3805", lot: "6", units: 84, rentStabilized: true,
    violationCount: 1, trustScore: 88, lat: 40.6688, lng: -74.1143,
    violations: [
      { date: "2024-07-30", code: "HMC §27-2005", description: "Gym emergency exit sign not illuminated", severity: "Minor", status: "Closed" }
    ],
    avgRating: 4.3
  },
  {
    id: 10, name: "Metro East", price: 1950, city: "Kearny", zip: "07032",
    beds: 1, baths: 1, sqft: 680, badge: null,
    amenities: ["Laundry", "Parking"],
    address: "215 Kearny Ave", borough: "Hudson County",
    block: "1504", lot: "22", units: 32, rentStabilized: false,
    violationCount: 5, trustScore: 55, lat: 40.7606, lng: -74.1460,
    violations: [
      { date: "2025-02-10", code: "HMC §27-2017", description: "Mice infestation in Units 1A, 1B, 1C", severity: "Serious", status: "Open" },
      { date: "2024-11-05", code: "HMC §27-2029", description: "No hot water in building for 4 days", severity: "Hazardous", status: "Closed" },
      { date: "2024-08-20", code: "HMC §27-2013", description: "Water damage in ceiling of Unit 4D", severity: "Serious", status: "Closed" },
      { date: "2024-05-15", code: "HMC §27-2005", description: "Building entrance door lock broken", severity: "Serious", status: "Closed" },
      { date: "2023-12-10", code: "HMC §27-2013", description: "Paint peeling in multiple units", severity: "Minor", status: "Closed" }
    ],
    avgRating: 2.5
  }
];

//Returns buildings from the server
//Falls back to BUILDINGS_STATIC if the server returned an empty array
window.getBuildings = function() {
  if (window.BUILDINGS_BASE && window.BUILDINGS_BASE.length > 0) {
    return window.BUILDINGS_BASE;
  }
  return window.BUILDINGS_STATIC;
};
