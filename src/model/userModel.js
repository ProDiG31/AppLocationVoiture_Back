// Require Mongoose
const mongoose = require('mongoose'); // mongoDB client
const bcrypt = require('bcrypt'); // crypter

const SALT_WORK_FACTOR = 10; // cryptation degree
const MAX_LOGIN_ATTEMPTS = 5; // number of try to connect
const LOCK_TIME = 2 * 60 * 60 * 1000; // Locking Account time

// Define a schema
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  firstname: String,
  username: {
    type: String,
    required: true,
    unique: true,
  },
  mail: {
    type: String,
    required: true,
    unique: true,
  },
  location: String,
  admin: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: String,
  created_at: Date,
  updated_at: Date,
  birthDate: Date,

  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number },
});

// A chaque enregistrement en base
userSchema.pre('save', (next) => {
  const user = this;
  // const salt = bcrypt.genSaltSync(10);
  const currentDate = new Date();

  // change the updated_at field to current date
  user.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!user.created_at) { user.created_at = currentDate; }

  // console.log("Password : " + this.password)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return err;
    // console.log(user)
    // hash the password using our new salt
    bcrypt.hash(user.password, salt, (errCrypt, hash) => {
      if (errCrypt) return errCrypt;
      // console.log("Hash = "+ hash)
      // override the cleartext password with the hashed one
      user.password = hash;
      return next();
    });
  });
});

// expose enum on the model, and provide an internal convenience reference
const reasons = userSchema.statics.failedLogin = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1,
  MAX_ATTEMPTS: 2,
};

// ajout de la methode permettant de comparer les mots de passe.
userSchema.methods.comparePassword = function (candidatePassword, cb) {
  console.log(`Candidat = ${candidatePassword}`);
  console.log(`Password to compare = ${this.password}`);
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};


userSchema.methods.incLoginAttempts = function (cb) {
  // if we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.update({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    }, cb);
  }
  // otherwise we're incrementing
  const updates = { $inc: { loginAttempts: 1 } };
  // lock the account if we've reached max attempts and it's not locked already
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + LOCK_TIME };
  }
  return this.update(updates, cb);
};


userSchema.virtual('isLocked').get(function () {
  // check for a future lockUntil timestamp
  return !!(this.lockUntil && this.lockUntil > Date.now());
});


userSchema.statics.getAuthenticated = function (username, password, cb) {
  this.findOne({ username }, (err, user) => {
    if (err) return cb(err);

    // make sure the user exists
    if (!user) {
      return cb(null, null, reasons.NOT_FOUND);
    }

    // check if the account is currently locked
    if (user.isLocked) {
      // just increment login attempts if account is already locked
      return user.incLoginAttempts((err) => {
        if (err) return cb(err);
        return cb(null, null, reasons.MAX_ATTEMPTS);
      });
    }

    // test for a matching password
    user.comparePassword(password, (errCompare, isMatch) => {
      if (errCompare) return cb(errCompare);

      // check if the password was a match
      if (isMatch) {
        // if there's no lock or failed attempts, just return the user
        if (!user.loginAttempts && !user.lockUntil) return cb(null, user);
        // reset attempts and lock info
        const updates = {
          $set: { loginAttempts: 0 },
          $unset: { lockUntil: 1 },
        };
        return user.update(updates, (errUpdate) => {
          if (errUpdate) return cb(errUpdate);
          return cb(null, user);
        });
      }

      // password is incorrect, so increment login attempts before responding
      user.incLoginAttempts((errLogin) => {
        if (errLogin) return cb(errLogin);
        return cb(null, null, reasons.PASSWORD_INCORRECT);
      });
    });
  });
};

// Compile model from schema
// export default mongoose.model('User', userSchema);
module.exports = mongoose.model('User', userSchema);
