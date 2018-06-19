const { Router } = require('express');

const userRouter = Router();
const Models = require('../model/index');

// Load database Connection
require('../services/dbService');

userRouter.post('/newUser', (req, res) => {
  console.log('[POST] - Creation user Handle');
  // fill user from /POST data body and save in database
  const newUser = Models.User(req.body);

  // Save new user
  newUser.save((err) => {
    if (err) throw err;
    res.write('User Created ');
    res.end();
  });
});

userRouter.get('/user/:username', (req, res) => {
  console.log('[GET] - Consulting user');
  //   console.log('username = ' + req.)
  Models.User.findOne({ username: req.params.username }, (err, user) => {
    if (err) throw err;

    console.log('User found');
    // console.log(res)

    console.log(user);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(user));
    res.end();
  });
});

module.exports = userRouter;
