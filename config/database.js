// Database Configuration
const mongoose = require('mongoose');

// MongoDB connection URL
// For local MongoDB: mongodb://localhost:27017/studentaward
// For cloud MongoDB Atlas: Replace with your connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studentaward';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✓ MongoDB Connected Successfully');
    } catch (error) {
        console.error('✗ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
