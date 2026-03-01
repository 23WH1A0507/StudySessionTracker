const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const { connectDB } = require('./src/utils/Connect');

(async () => {
  try {
    await connectDB();
    // Run the main app script (seeding/display script in src/app.js)
    require('./src/app');
  } catch (err) {
    console.error('Failed to start application:', err);
    process.exit(1);
  }
})();
