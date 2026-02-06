// start server
require('dotenv').config();
// require('dotenv').config(); // Removed redundant call if already in app or entry point


const app = require('./src/app');
const connectDB = require('./src/db/db');

connectDB();

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})