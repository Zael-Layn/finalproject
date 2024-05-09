const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatesSchema = new Schema({
     statecode: {
        type: String, 
        required: true,
        unique: true
    },
    funfacts: [String] 
    
});

module.exports = mongoose.model('State', StatesSchema);