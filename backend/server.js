// start server
require('dotenv').config();
// require('dotenv').config(); // Removed redundant call if already in app or entry point


const app = require('./src/app');
const connectDB = require('./src/db/db');

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})