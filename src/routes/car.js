const { Router } = require('express');

const carRouter = Router();
const Models = require('../model/index');

carRouter.post('/Car/new', (req, res) => {
  console.log('[POST] - Creation Car Handle');

  Models.User.findOne({ username: req.body.owner }, (err, user) => {
    if (err) throw err;

    console.log('User Found');
    req.body.owner = user._id;
    const newCar = Models.Car(req.body);

    // Save new user
    newCar.save((errSave) => {
      if (errSave) throw errSave;
      res.write('Car Created ');
      res.end();
    });
  });
});

carRouter.get('/car/:id', (req, res) => {
  console.log('[GET] - Consulting car');
  //   console.log('username = ' + req.)
  Models.Car.findById(req.params.id, (err, user) => {
    if (err) throw err;

    console.log('car found');
    // console.log(res)

    console.log(user);
    res.setHeader('Content-Type', 'application/json');

    res.send(JSON.stringify(user));
    res.end();
  });
});

module.exports = carRouter;
