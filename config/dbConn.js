const mongoose = require('mongoose');
const uri = 'mongodb+srv://swagner4:Eclipse7@cluster0.hvscj6t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error(err);
    }
};

module.exports = connectDB;
