//Require Mongoose
const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

let carSchema = new Schema({
    model: String,
    brand: String,
    color: String,
    seats : Number,   
    motor: String, 
    consuming : Number,
    gearbox : String, 
    counter: Number,
    doorNumber : Number, 
    type : String, 
    feature : [String], 
    manufactureYear: Date, 
    owner : {type : Schema.Types.ObjectId, ref: 'user'}
});

// Compile model from schema
module.exports = mongoose.model('car', carSchema );