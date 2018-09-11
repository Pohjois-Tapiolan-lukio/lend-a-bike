const express = require('express');
const mongoose = require('mongoose');

const Bike = require('../models/bike');
const auth = require('../auth');

const router = express.Router();

router.get('/', (req, res, _) => {
  Bike.find()
    .select('_id name bikeId usage')
    .then((bikes) => {
      res.status(200)
        .json(bikes);
    })
    .catch((error) => {
      res.status(500)
        .json({
          error,
        });
    });
});

router.get('/:bikeId', (req, res, _) => {
  Bike.findOne({
    _id: req.params.bikeId,
  })
    .select('_id name bikeId usage')
    .then((bike) => {
      res.status(200)
        .json(bike);
    })
    .catch((error) => {
      res.status(500)
        .json({
          error,
        });
    });
});

router.post('/', auth, (req, res, _) => {
  const bike = new Bike({
    _id: new mongoose.Types.ObjectId(),
    bikeId: req.body.bikeId,
    name: req.body.name,
  });
  bike.save()
    .then((result) => {
      res.status(200)
        .json(result);
    })
    .catch((error) => {
      res.status(500)
        .json({
          error,
        });
    });
});

router.patch('/:bikeId', auth, (req, res, _) => {
  Bike.findOne({
    _id: req.params.bikeId,
  })
    .then((bike) => {
      Bike.update(bike, req.body)
        .then((result) => {
          res.status(200)
            .json(result);
        })
        .catch((error) => {
          res.status(500).json({
            error,
          });
        });
    })
    .catch((error) => {
      res.status(400)
        .json({
          message: error,
        });
    });
});

module.exports = router;

// vim: et ts=2 sw=2 :
