# StableStay
A full-stack web application that helps users discover, filter, and analyze NYC housing listings using open city datasets, including rent-stabilized building data and housing violations.

## Team Members

- Jocelyn Mo
- Victor Li
- Hadeer Motair
- Zechuan Wu

## Project Description

StableStay displays available residential buildings and apartments across NYC, including details like location, rent-stabilization status, building size, and violation history — all sourced from publicly available data. Users can leave reviews, report issues, bookmark buildings, and explore listings on an interactive map.

## Core Features

### Landing Page
- Overview of the platform's purpose and functionality
- Navigation guide for new users
- Quality survey at the bottom of the page

### User Profile Page
- Displays user name, email (editable), and phone number (editable)
- Sign out functionality
- Favorites list (AJAX-powered, add/remove buildings)

### Buildings Page
- List view of all buildings
- Search and filter functionality (borough, rent-stabilized, violation count)

### Building Detail Page
- Full building info: address, borough, block/lot, number of units, rent-stabilization status
- **Composite Trust Score** calculated from:
  - Number of NYC Housing Maintenance Code violations
  - Rent-stabilization status
  - Average user review rating
- Violation history (sortable table) from the NYC Housing Maintenance Code Violations dataset
- Violation severity explainer — translates raw codes into plain English with severity ratings (Minor / Serious / Hazardous)
- User reviews section (one review per user, with edit/delete)
- User-reported issues section (pests, noise, maintenance neglect, etc.)
- Q&A section — users can post and answer questions about a building
- Comments section — multiple comments per user with timestamps and delete
- Favorite/bookmark button

### Review System
- One review per user per building (star rating 1–5 + written feedback)
- Edit and delete own reviews
- Upvot
