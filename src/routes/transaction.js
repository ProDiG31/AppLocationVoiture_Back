const { Router } = require('express');

const transacRouter = Router();
const Models = require('../model');

transacRouter.post('/rent', (req, res) => {
  console.log('[POST] - Rent Car Handle');

  const rentedCarOwnerId = fetch(`/car/${req.body.carId}`).then(data => data.body.owner);
  console.log('[INFO] - Car owner founded in database');

  const newRent = {
    carOwnerId: req.body.carOwnerId,
    carId: req.body.carId,
    carRenterId: rentedCarOwnerId,
    StartDate: req.body.StartDate,
    EndDate: req.body.EndDate,
  };

  // Save new user
  newRent.save((err) => {
    if (err) throw err;
    res.write('Rent Created ');
    res.end();
  });
});

transacRouter.get('/rents/:carId', (req, res) => {
  console.log('[GET] - get all rents of the Car Handle');
  Models.Rent.find({ carId: req.params.carId }, (err, rents) => {
    if (err) throw err;
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(rents));
    res.end();
  });
});

