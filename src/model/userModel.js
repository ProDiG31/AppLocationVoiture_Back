//Require Mongoose
const mongoose = require('mongoose');   // mongoDB client
const bcrypt = require('bcrypt');       // crypter
const SALT_WORK_FACTOR = 10;            // cryptation degree

//Define a schema
const Schema = mongoose.Schema;


let userSchema = new Schema({
    name: { type: String, required: true },
    firstname: String, 
    username:  { 
        type: String, 
        required: true, 
        unique: true 
    }, 
    mail : { 
        type: String, 
        required: true, 
        unique: true 
    },
    location: String,  
    admin : Boolean,
    password :   {
        type: String,
        required: true,
        match: /(?=.*[a-zA-Z])(?=.*[0-9]+).*/,
        minlength: 12
    },
    created_at: Date, 
    updated_at: Date,
    birthDate : Date,

    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Number }
});

// A chaque enregistrement en base 
userSchema.pre("save", function (next) {

    user = this;
    // const salt = bcrypt.genSaltSync(10);  
    const currentDate = new Date();

    // change the updated_at field to current date
    user.updated_at = currentDate;
        
    // if created_at doesn't exist, add to that field
    if (!user.created_at)
        user.created_at = currentDate;


    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            console.log("Hash = "+ hash)

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

// expose enum on the model, and provide an internal convenience reference 
var reasons = userSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};

// ajout de la methode permettant de comparer les mots de passe.
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


userSchema.methods.incLoginAttempts = function(cb) {
    // if we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.update({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        }, cb);
    }
    // otherwise we're incrementing
    var updates = { $inc: { loginAttempts: 1 } };
    // lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }
    return this.update(updates, cb);
};


userSchema.statics.getAuthenticated = function(username, password, cb) {
    this.findOne({ username: username }, function(err, user) {
        if (err) return cb(err);

        // make sure the user exists
        if (!user) {
            return cb(null, null, reasons.NOT_FOUND);
        }

        // check if the account is currently locked
        if (user.isLocked) {
            // just increment login attempts if account is already locked
            return user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.MAX_ATTEMPTS);
            });
        }

        // test for a matching password
        user.comparePassword(password, function(err, isMatch) {
            if (err) return cb(err);

            // check if the password was a match
            if (isMatch) {
                // if there's no lock or failed attempts, just return the user
                if (!user.loginAttempts && !user.lockUntil) return cb(null, user);
                // reset attempts and lock info
                var updates = {
                    $set: { loginAttempts: 0 },
                    $unset: { lockUntil: 1 }
                };
                return user.update(updates, function(err) {
                    if (err) return cb(err);
                    return cb(null, user);
                });
            }

            // password is incorrect, so increment login attempts before responding
            user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.PASSWORD_INCORRECT);
                });
            });
        });
    }

// Compile model from schema
module.exports = mongoose.model('User', userSchema );