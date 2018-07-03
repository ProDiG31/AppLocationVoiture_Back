// Require Mongoose
const mongoose = require('mongoose');

//  Define a schema
const Schema = mongoose.Schema;

const rentSchema = new Schema({
  carOwnerId: { type: Schema.Types.ObjectId, ref: 'user' },
  carId: { type: Schema.Types.ObjectId, ref: 'car' },
  carRenterId: { type: Schema.Types.ObjectId, ref: 'user' },
  StartDate: Date,
  EndDate: Date,
  validated: Boolean,
  register_at: Date,
  achieved: Boolean,
});

function compareDate(rent, rentReserved) {
  // If la nouvelle reservation demarre apres mais le debut mais avant la fin de l'ancienne reservation
  if (rent.StartDate > rentReserved.StartDate) {
    if (rent.StartDate < rentReserved.EndDate) {
      return false;
    }
  }
  // If la nouvelle reservation demarre avant le debut mais fini apres le debut de l'ancienne
  if (rent.StartDate < rentReserved.StartDate) {
    if (rent.EndDate > rentReserved.StartDate) {
      return false;
    }
  }
  return true;
}


rentSchema.pre('save', async (next) => {
  const rent = this;
  this.register_at = new Date();

  const canBeRegistered = await rentSchema.find({
    carId: rent.carId,
    achieved: false,
  }, (err, rents) => {
    if (err) throw err;
    // let isAvailable = true;
    const rentAvailable = rents.filter(r => !compareDate(rent, r));
    return rentAvailable.length > 0;
  });

  if (canBeRegistered) next();
  // throw Error('Another rent is confirmed on this date');
});


// Compile model from schema
module.exports = mongoose.model('rent', rentSchema);
