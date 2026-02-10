⛪ PCEA St. Andrew's Church Management System
A high-performance "Command Center" and public portal for managing church media, technical staff, shop inventory, and facility bookings.

🚀 1. Getting Started (Local)
Prerequisites
Node.js: v18 or higher.

Database: Local MongoDB instance (Compass) or MongoDB Atlas.

Installation
Clone & Install:

Bash
cd server && npm install
cd ../client && npm install
Environment Configuration: Create a .env file in the /server folder:

Code snippet
MONGO_URI=mongodb://localhost:27017/st_andrews_db
JWT_SECRET=your_secret_key
PORT=5000
Run the App:

Backend: npm run dev

Frontend: npm start

🌐 2. Deployment to cPanel
Database Setup (MongoDB Atlas)
Cloud Database: Use MongoDB Atlas for the production database.

IP Whitelisting: Set Network Access to 0.0.0.0/0 in Atlas to ensure the cPanel host can always connect.

Data Import: Export your local collections as JSON from MongoDB Compass and import them into your Atlas clusters.

Hosting the App
Node.js Selector: Use cPanel's "Setup Node.js App" tool.

Static Assets: Run npm run build in the /client folder and upload the contents of the build/ folder to your cPanel public_html.

Media Storage: Manually upload the /server/uploads folder to the server. Ensure the folder has 755 permissions so the server can save new images.

🔐 3. Accessing the Admin Panel
The STACN Admin (Command Center) is accessible at pceastandrews.org/admin.

Key Modules:
ICT & Media: Manage Ministry Leaders and Technical Staff. Includes a squad production center for uploading team photos (max 5 per squad).

Shop Inventory: Add products with up to 5 images, manage stock levels, and track customer orders.

Facility Management: Register church spaces, set hourly rates, and manage capacity.

Event Forms: View real-time registrations. Filter by event to verify attendees and confirm M-Pesa transaction codes.

📁 4. System Maintenance
Updating Content: When updating images for squads, rooms, or products, the system automatically saves them to the local server storage to save on cloud costs.

Restarting: After uploading code changes to cPanel, you must click "Restart" in the cPanel Node.js App interface for changes to take effect.

PWA & Icons: The site is PWA-ready. Favicons and manifests are located in the /public folder and are pre-configured for mobile installation.