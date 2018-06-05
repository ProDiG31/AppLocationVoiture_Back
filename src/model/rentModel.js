//Require Mongoose
const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

let rentSchema = new Schema({
    carOwner : {type : Schema.Types.ObjectId, ref: 'user'}, 
    car : {type : Schema.Types.ObjectId, ref: 'car'},
    carRenter : {type : Schema.Types.ObjectId, ref: 'user'}, 
    description : String, 
    StartDate : Date,
    EndDate : Date
});

// Compile model from schema
module.exports = mongoose.model('rent', rentSchema );