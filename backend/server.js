const dotenv = require('dotenv');
const app = require('./src/app');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'production';

app.listen(PORT, () => {
    console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to check server status.`);
});
