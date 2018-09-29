const express = require('express');
const mongoose = require('mongoose');

const Bike = require('../models/bike');
const auth = require('../auth');

const router = express.Router();

router.get('/', (req, res, _) => {
  Bike.find()
    .select('_id name bikeNumber usage')
    .then(bikes => {
      res.status(200).json(bikes);
    })
    .catch(error => {
      res.status(500).json({
        error,
      });
    });
});

router.get('/:bikeNumber', (req, res, _) => {
  Bike.findOne({
    _id: req.params.bikeNumber,
  })
    .select('_id name bikeNumber usage')
    .then(bike => {
      res.status(200).json(bike);
    })
    .catch(error => {
      res.status(500).json({
        error,
      });
    });
});

router.post('/', auth, (req, res, _) => {
  Bike.findOne({
    bikeNumber: req.body.bikeNumber,
  })
    .then(conflictingBike => {
      if (conflictingBike !== null) {
        const e = new Error('The bikeNumber is already claimed!');
        e.name = 'ConflictError';
        throw e;
      }
      return new Bike({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        bikeNumber: req.body.bikeNumber,
      }).save();
    })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      //console.log(error);
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        res.status(400).json({
          error,
        });
      } else if (error.name === 'ConflictError') {
        res.status(409).json({
          error,
        });
      } else {
        res.status(500).json({
          error,
        });
      }
    });
});

router.patch('/:bikeNumber', auth, (req, res, _) => {
  Bike.findOne({
    _id: req.params.bikeNumber,
  })
    .then(bike => {
      Bike.update(bike, req.body)
        .then(result => {
          res.status(200).json(result);
        })
        .catch(error => {
          res.status(500).json({
            error,
          });
        });
    })
    .catch(error => {
      res.status(400).json({
        message: error,
      });
    });
});

router.delete('/:bikeNumber', auth, (req, res, _) => {
  Bike.findOne({
    _id: req.params.bikeNumber,
  })
    .remove()
    .then(result => {
      res.status(200).json({
        result,
        message: 'Bike removed!',
      });
    })
    .catch(error => {
      res.status(400).json({
        message: error,
      });
    });
});

module.exports = router;

// vim: et ts=2 sw=2 :
