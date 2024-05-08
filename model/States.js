const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//schema for mongodb
const StatesSchema = new Schema({
     statecode: {
        type: String, 
        required: true,
        unique: true
    },
    funfacts: [String] 
    
});

module.exports = mongoose.model('State', StatesSchema);