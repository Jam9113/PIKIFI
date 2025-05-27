# PIKIFI Dashboard

A payroll management system built with Node.js, HTML,Javascript, Express, and MongoDB.

## Installation

1. Install dependencies and cors: `npm install'
2. Start MongoDB service
3. Run the application: `node server.js`
4. Open browser to `http://localhost:3000`

## Changelog

### May 24, 2025 - 6:15 PM
**Major UI/UX Improvements & Database Setup**

**Database Setup:**
- Installed MongoDB Compass
- monthpaydb' database
- Fixed deprecated mongoose connection options in server.js

**UI/UX Enhancements:**
- Implemented persistent sidebar navigation across all pages
- Replaced individual "back to dashboard" buttons with unified navigation
- Updated navigation order: Dashboard → Employees → Payroll → 13th Month Pay
- Changed "Employee" to "Employees" for consistency with dashboard widgets
- Updated employee icon from user-tie to users for better representation

**Layout Improvements:**
- Converted payroll form (test.html) to two-column grid layout
- Left column: Employee info (name, rate, hours, days, gross salary)
- Right column: Deductions (tax, PhilHealth, SSS, total deduction, net salary)
- Added responsive design for mobile devices

**Visual Design:**
- Standardized color scheme: #4A90E2 background, #3B5998 containers
- Applied consistent PIKIFI branding across all pages
- Implemented Font Awesome icons throughout navigation
- Added currency symbols (₱) to monetary fields
- Consistent 12px border-radius and 30px padding

**Technical Fixes:**
- Corrected static file serving path in server.js
- Added proper responsive breakpoints (768px, 600px)
- Implemented active page highlighting in navigation
- Added hover effects and smooth transitions

**Files Modified:**
- server.js - MongoDB connection and static file serving
- index.html - Navigation order and icon updates
- Employee.html - Sidebar implementation and styling
- test.html - Two-column layout and sidebar navigation
- monthpay.html - Sidebar navigation and clean structure
- Added .gitignore and README.md
