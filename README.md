# StableStay

A full-stack web application that helps users discover, filter, and analyze NYC housing listings using open city datasets, including rent-stabilized building data and housing violations.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed the Database
```bash
npm run seed
```

### 3. Start the Application
```bash
npm start
```

---

## Team Members

- Jocelyn Mo
- Victor Li
- Hadeer Motair
- Zechuan Wu

---

## Project Description

StableStay displays residential buildings and apartments across NYC, including details such as:

- Location
- Rent-stabilization status
- Building size
- Housing violation history

All data is sourced from publicly available NYC datasets.

Users can:

- Leave reviews
- Report issues
- Bookmark buildings
- Explore listings on an interactive map
- Ask and answer questions about properties

---

# Core Features

## Landing Page

- Overview of the platform and its purpose
- Navigation guide for new users
- Quality survey at the bottom of the page

---

## User Profile Page

- Displays user name
- Editable email and phone number
- Sign out functionality
- Favorites list with AJAX-powered add/remove support

---

## Buildings Page

- List view of all buildings
- Search and filtering system

### Filters Include

- City
- Ammentities
- Violation count

---

## Building Detail Page

Displays detailed information including:

- Address
- Borough
- Block/Lot number
- Number of units
- Rent-stabilization status

### Composite Trust Score

Calculated using:

- Number of NYC Housing Maintenance Code violations
- Rent-stabilization status
- Average user review rating

### Additional Features

- History
- Violation severity explainer:
  - Minor
  - Serious
  - Hazardous
- User reviews
- User-reported issues
- Q&A section
- Comments section
- Favorite/bookmark button

---

## Review System

- One review per user per building
- Star ratings from 1–5
- Written feedback support
- Users can edit or delete their own reviews
- Reviews sorted by most recent
- Average rating displayed on:
  - Building cards
  - Building detail pages
- Upvote/helpful review system

---

## Admin Dashboard

Pre-seeded admin account with permissions to:

- Add buildings
- Edit buildings
- Delete buildings
- Moderate reviews
- Moderate comments

Includes support for modifying dataset-sourced buildings.

---

# Extra Features

---

### Features

- Building locations displayed as pins
- Clicking a pin opens the building detail page
- Map filters match list view filters:
  - Borough
  - Rent-stabilized status
  - Violation count

---

## Notifications

Users can opt in for notifications about:

- New listings
- Updates to existing listings
- Direct messages from landlords/agents
- New violations or reviews on favorited buildings

Users can also subscribe to listings in saved boroughs or neighborhoods.

---

## Recently Viewed Buildings

- Displays previously visited buildings for quick access

---

## Questions & Answers

Users can:

- Post questions about buildings
- Answer questions from other users
- Interact with verified tenant responses

### Example Questions

- “Is this place pet friendly?”
- “Is it easy to hear the neighbors?”

---

## Comments & Community Interaction

- Users can comment on reviews
- Threaded discussion support
- Upvote/downvote review helpfulness

---

## Additional Features

### Violation Severity Explainer

- Converts raw NYC violation codes into plain English
- Displays severity levels:
  - Minor
  - Serious
  - Hazardous
