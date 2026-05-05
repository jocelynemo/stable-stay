// data.js - single source of truth for buildings data (loaded before all other scripts)

window.BUILDINGS_BASE = [
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
    avgRating: 4.2,
    reviews: [
      { user: "JaneD", rating: 5, text: "Great location, doorman is very helpful. Building is well maintained.", date: "2025-03-10" },
      { user: "MikeR", rating: 4, text: "Good value for the area. Gym is small but functional.", date: "2025-01-22" },
      { user: "SaraL", rating: 3, text: "Had some issues with heat last winter but management responded quickly.", date: "2024-12-05" }
    ],
    reportedIssues: [
      { user: "Tenant22", type: "Noise", description: "Loud neighbors on weekends past midnight.", date: "2025-02-14" }
    ],
    comments: [
      { user: "Alex_R", text: "Is parking included in the rent?", date: "2025-04-01" },
      { user: "Mgmt_Office", text: "Parking is available for an additional $150/month.", date: "2025-04-02" }
    ]
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
      { date: "2024-05-10", code: "HMC §27-2005", description: "Broken intercom system", severity: "Minor", status: "Closed" },
      { date: "2023-11-30", code: "HMC §27-2013", description: "Peeling paint in Unit 3B", severity: "Minor", status: "Closed" },
      { date: "2023-09-14", code: "HMC §27-2011", description: "Hot water supply inadequate", severity: "Serious", status: "Closed" },
      { date: "2023-06-02", code: "HMC §27-2005", description: "Front door lock broken", severity: "Serious", status: "Closed" }
    ],
    avgRating: 2.8,
    reviews: [
      { user: "TomH", rating: 2, text: "Heat went out twice this winter. Management was very slow to respond.", date: "2025-02-01" },
      { user: "LauraM", rating: 3, text: "Location is great but the building has had issues.", date: "2024-11-10" },
      { user: "RyanK", rating: 4, text: "Renovated unit is nice. Parking spot is a huge plus.", date: "2024-08-20" }
    ],
    reportedIssues: [
      { user: "Unit4A", type: "Maintenance Neglect", description: "Reported broken heater 3 weeks ago, still not fixed.", date: "2025-01-20" },
      { user: "Unit2C", type: "Pests", description: "Cockroaches in kitchen despite exterminator visit.", date: "2024-10-22" }
    ],
    comments: [
      { user: "ProspectiveTenant", text: "How is the noise from the street?", date: "2025-03-15" },
      { user: "CurrentResident", text: "River St gets noisy on weekend nights but it's manageable.", date: "2025-03-16" }
    ]
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
    avgRating: 4.7,
    reviews: [
      { user: "CarlaP", rating: 5, text: "Rooftop is amazing. Management is very responsive.", date: "2025-04-01" },
      { user: "DanielW", rating: 5, text: "Best apartment I've had. Huge 3BR for the price.", date: "2025-02-18" },
      { user: "NinaS", rating: 4, text: "Pet friendly and the gym is surprisingly well equipped.", date: "2025-01-05" }
    ],
    reportedIssues: [],
    comments: [
      { user: "FutureRenter", text: "Are utilities included?", date: "2025-04-10" },
      { user: "CurrentTenant", text: "Water and heat are included, electricity is separate.", date: "2025-04-11" }
    ]
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
    avgRating: 4.0,
    reviews: [
      { user: "JennaB", rating: 4, text: "Amazing views of the Hudson. Doorman is great.", date: "2025-03-20" },
      { user: "MarkT", rating: 4, text: "Parking is convenient. A bit pricey but worth it for the views.", date: "2025-01-14" }
    ],
    reportedIssues: [
      { user: "Unit8F", type: "Noise", description: "Construction noise starts at 7am on weekdays.", date: "2025-03-01" }
    ],
    comments: [
      { user: "LookingToMove", text: "Is the ferry to Manhattan nearby?", date: "2025-04-05" },
      { user: "Resident2yr", text: "Yes! Port Imperial Ferry is a 5 min walk.", date: "2025-04-05" }
    ]
  },
  {
    id: 5, name: "Palisade Commons", price: 1600, city: "North Bergen", zip: "07047",
    beds: 1, baths: 1, sqft: 570, badge: "Deal",
    amenities: ["Laundry", "Parking"],
    address: "7200 Palisade Ave", borough: "Hudson County",
    block: "2201", lot: "9", units: 36, rentStabilized: true,
    violationCount: 0, trustScore: 95, lat: 40.7932, lng: -74.0347,
    violations: [],
    avgRating: 4.5,
    reviews: [
      { user: "SophiaR", rating: 5, text: "Best deal in the area. Quiet street, parking included.", date: "2025-04-02" },
      { user: "EthanL", rating: 4, text: "Small but efficient layout. Laundry in building is a plus.", date: "2025-02-10" }
    ],
    reportedIssues: [],
    comments: [
      { user: "NewToArea", text: "How is the commute to NYC?", date: "2025-03-28" },
      { user: "Resident1yr", text: "Bus 156 takes about 25 min to Port Authority. Not bad!", date: "2025-03-28" }
    ]
  },
  {
    id: 6, name: "Exchange Place Suites", price: 3400, city: "Jersey City", zip: "07311",
    beds: 2, baths: 2, sqft: 1050, badge: "New",
    amenities: ["Gym", "Rooftop", "Doorman", "Pet Friendly"],
    address: "25 Exchange Place", borough: "Hudson County",
    block: "1105", lot: "1", units: 200, rentStabilized: false,
    violationCount: 0, trustScore: 93, lat: 40.7165, lng: -74.0332,
    violations: [],
    avgRating: 4.8,
    reviews: [
      { user: "ChrisM", rating: 5, text: "Brand new building, everything is top quality. Rooftop pool is incredible.", date: "2025-04-15" },
      { user: "AmandaK", rating: 5, text: "Concierge is helpful, gym is huge. Worth every penny.", date: "2025-03-30" },
      { user: "PeterJ", rating: 4, text: "Love it but it is pricey. Dog-friendly which is great.", date: "2025-02-20" }
    ],
    reportedIssues: [],
    comments: [
      { user: "Curious22", text: "Is there a waitlist for units?", date: "2025-04-12" },
      { user: "LeasingOffice", text: "Yes, a few units opening in June. Contact us directly.", date: "2025-04-13" }
    ]
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
    avgRating: 3.5,
    reviews: [
      { user: "BrianF", rating: 3, text: "Decent apartment for the price. Park views are nice.", date: "2025-02-28" },
      { user: "LisaG", rating: 4, text: "Management has improved a lot over the past year.", date: "2025-01-10" }
    ],
    reportedIssues: [
      { user: "Tenant5C", type: "Maintenance Neglect", description: "Water stain on ceiling still present after repair.", date: "2025-02-05" }
    ],
    comments: [
      { user: "ParksLover", text: "How close is Lincoln Park actually?", date: "2025-03-10" },
      { user: "ParkResident", text: "Right across the street! Great for dogs.", date: "2025-03-10" }
    ]
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
    avgRating: 3.2,
    reviews: [
      { user: "KarenW", rating: 3, text: "Affordable but basic. Heat was an issue last winter.", date: "2025-01-25" },
      { user: "JoshP", rating: 3, text: "Quiet neighborhood. Could use some updates to common areas.", date: "2024-11-08" }
    ],
    reportedIssues: [
      { user: "Unit1A", type: "Maintenance Neglect", description: "Hallway light has been out for 2 weeks.", date: "2025-03-22" }
    ],
    comments: []
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
    avgRating: 4.3,
    reviews: [
      { user: "MirandaJ", rating: 5, text: "Spacious 3BR at a fair price. Gym is well maintained.", date: "2025-03-05" },
      { user: "DavidN", rating: 4, text: "Pet friendly and management is easy to reach. Parking is included!", date: "2025-01-18" },
      { user: "YvetteC", rating: 4, text: "Great for families. Very quiet building.", date: "2024-12-29" }
    ],
    reportedIssues: [],
    comments: [
      { user: "FamilyRenter", text: "Are there any 3BR units available now?", date: "2025-04-08" },
      { user: "Management", text: "One unit opening May 1st. Please contact our office.", date: "2025-04-08" }
    ]
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
    avgRating: 2.5,
    reviews: [
      { user: "TinaM", rating: 2, text: "Mice problem is serious and management is slow to act.", date: "2025-03-01" },
      { user: "CarlosB", rating: 3, text: "Affordable for the area but has had issues. Parking is convenient.", date: "2024-10-15" }
    ],
    reportedIssues: [
      { user: "Unit1B", type: "Pests", description: "Mice in kitchen. Set traps but they keep coming back.", date: "2025-02-15" },
      { user: "Unit3A", type: "Maintenance Neglect", description: "Hot water outage not fixed for a week.", date: "2024-11-08" }
    ],
    comments: [
      { user: "Considering", text: "Is the mice issue still ongoing?", date: "2025-04-10" },
      { user: "Unit1A_Res", text: "Yes, unfortunately still an issue as of April 2025.", date: "2025-04-11" }
    ]
  }
];

// Returns effective buildings: base data + admin additions, minus admin deletions
window.getBuildings = function() {
  var hidden  = JSON.parse(localStorage.getItem("adminHiddenBuildings")  || "[]");
  var added   = JSON.parse(localStorage.getItem("adminAddedBuildings")   || "[]");
  var edits   = JSON.parse(localStorage.getItem("adminEditedBuildings")  || "{}");

  var result = [];
  for (var i = 0; i < window.BUILDINGS_BASE.length; i++) {
    var b = window.BUILDINGS_BASE[i];
    if (hidden.indexOf(b.id) !== -1) continue;
    if (edits[b.id]) {
      // shallow merge of editable fields
      var merged = {};
      for (var k in b) merged[k] = b[k];
      var e = edits[b.id];
      for (var k2 in e) merged[k2] = e[k2];
      result.push(merged);
    } else {
      result.push(b);
    }
  }
  for (var j = 0; j < added.length; j++) {
    if (hidden.indexOf(added[j].id) === -1) result.push(added[j]);
  }
  return result;
};

// Unique key for a review (for admin deletion tracking)
window.reviewKey = function(buildingId, review) {
  return buildingId + "_" + (review.userEmail || review.user) + "_" + review.date;
};

// Unique key for a comment
window.commentKey = function(buildingId, comment) {
  return buildingId + "_" + comment.user + "_" + comment.date;
};
