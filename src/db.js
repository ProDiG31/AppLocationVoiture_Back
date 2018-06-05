const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const User = require('./model/userModel');

// Router instance
const router = express.Router();   

const mongoCredential = ({
    host: process.env.DB_HOST,
    database: process.env.DB_BASE,
    port: process.env.DB_PORT, 
  });

  //Set up default mongoose connection
const url = "mongodb://"+mongoCredential.host+"/"+mongoCredential.database; 
mongoose.connect(url) 

// Get Mongoose to use the global promise library
// mongoose.Promise = global.Promise;

//Get the default connection
const db = mongoose.connection;

router.post('/newUser' , function (req, res) {
    console.log("[POST] - Creation user Handle")
    
    //fill user from /POST data body and save in database 
    newUser = User(req.body)
    
    //Save new user
    newUser.save((err) => {
        if (err) throw err;
        res.write("User Created "); 
        res.end();    
    });

})


router.post('/login', function (req, res) {
    console.log("[POST] - Login Request Handle")

    var username = req.body.username 
    var password = req.body.password
    
    // attempt to authenticate user
    User.getAuthenticated(username, password, function(err, user, reason) {
        if (err) throw err;

        // login was successful if we have a user
        if (user) {
            // handle login success
            console.log('login success');
            return ;
        }

        // otherwise we can determine why we failed
        var reasons = User.failedLogin;
        switch (reason) {
            case reasons.NOT_FOUND:
                console.log('Login Error Not found')
            case reasons.PASSWORD_INCORRECT:
            
                console.log('password false')
                // note: these cases are usually treated the same - don't tell
                // the user *why* the login failed, only that it did
                break;
            case reasons.MAX_ATTEMPTS:
            console.log('Max try attemps')
                // send email or otherwise notify user that account is
                // temporarily locked
                break;
            }
        });
    })
module.exports = router;


