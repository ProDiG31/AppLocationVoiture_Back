const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const User = require('./model/userModel');
const Car = require('./model/carModel');

// Router instance
const router = express.Router();

const mongoCredential = ({
  host: process.env.DB_HOST,
  database: process.env.DB_BASE,
  port: process.env.DB_PORT,
});

  // Set up default mongoose connection
const url = `mongodb://${mongoCredential.host}/${mongoCredential.database}`;
mongoose.connect(url);

// Get Mongoose to use the global promise library
// mongoose.Promise = global.Promise;

// Get the default connection
// const db = mongoose.connection;

router.post('/newUser', (req, res) => {
  console.log('[POST] - Creation user Handle');
  // fill user from /POST data body and save in database
  const newUser = User(req.body);

  // Save new user
  newUser.save((err) => {
    if (err) throw err;
    res.write('User Created ');
    res.end();
  });
});

router.post('/login', (req, res) => {
  console.log('[BODY] ');
  // console.log(req.body);
  console.log('[POST] - Login Request Handle');

  const username = req.body.username;
  const password = req.body.password;

  // attempt to authenticate user
  User.getAuthenticated(username, password, (err, user, reason) => {
    if (err) throw err;

    // login was successful if we have a user
    if (user) {
      // handle login success
      console.log('login success');
      res.write('login succes');
    }

    // otherwise we can determine why we failed
    const reasons = User.failedLogin;
    switch (reason) {
      case reasons.NOT_FOUND:
        console.log('Login Error Not found');
        break;
      case reasons.PASSWORD_INCORRECT:
        console.log('password false');
        break;
      case reasons.MAX_ATTEMPTS:
        console.log('Max try attemps');
        break;
      default:
        break;
    }
  });
});

router.post('/newCar', (req, res) => {
  console.log('[POST] - Creation Car Handle');

  User.findOne({ username: req.body.owner }, (err, user) => {
    if (err) throw err;

    console.log('User Found');
    req.body.owner = user._id;
    const newCar = Car(req.body);

    // Save new user
    newCar.save((errSave) => {
      if (errSave) throw errSave;
      res.write('Car Created ');
      res.end();
    });
  });
});

router.get('/user/:username', (req, res) => {
  console.log('[GET] - Consulting user');
  //   console.log('username = ' + req.)
  User.findOne({ username: req.params.username }, (err, user) => {
    if (err) throw err;

    console.log('User found');
    // console.log(res)

    console.log(user);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(user));
    res.end();
  });
});

router.get('/car/:id', (req, res) => {
  console.log('[GET] - Consulting car');
  //   console.log('username = ' + req.)
  Car.findById(req.params.id, (err, user) => {
    if (err) throw err;

    console.log('car found');
    // console.log(res)

    console.log(user);
    res.setHeader('Content-Type', 'application/json');

    res.send(JSON.stringify(user));
    res.end();
  });
});

router.post('/user/:username/cars', (req, res) => {

});


module.exports = router;

