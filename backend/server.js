// start server
require('dotenv').config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const app = require('./src/app');
const connectDB = require('./src/db/db');

connectDB();

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})