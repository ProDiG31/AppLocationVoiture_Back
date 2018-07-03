//  Require Mongoose
const mongoose = require('mongoose');

// const User = require('./userModel');

//  Define a schema
const Schema = mongoose.Schema;

const carSchema = new Schema({
  model: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  location: {
    longitude: {
      type: Number,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    string: {
      type: String,
      required: true,
    },
  },
  color: String,
  seats: Number,
  motor: String,
  consuming: Number,
  gearbox: String,
  counter: Number,
  doorNumber: Number,
  type: String,
  created_at: Date,
  updated_at: Date,
  feature: [String],
  comment: String,
  manufactureYear: Date,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
});

//  politique d'enregistrement en base de donnée
carSchema.pre('save', (next) => {
  const car = this;
  // const salt = bcrypt.genSaltSync(10);
  const currentDate = new Date();
  // change the updated_at field to current date
  car.updated_at = currentDate;
  // if created_at doesn't exist, add to that field
  if (!car.created_at) car.created_at = currentDate;

  //   if (!car.owner) car.owner = User.find({ username });

  next();
});

// Compile model from schema
// export default mongoose.model('car', carSchema);
module.exports = mongoose.model('car', carSchema);
