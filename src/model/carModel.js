//  Require Mongoose
import mongoose from 'mongoose';

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
    type: String,
    required: true,
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

  car;
  next();
});

// Compile model from schema
// export default mongoose.model('car', carSchema);
module.exports = mongoose.model('car', carSchema);
