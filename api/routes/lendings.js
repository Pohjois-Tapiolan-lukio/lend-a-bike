const express = require('express');
const mongoose = require('mongoose');

const Lending = require('../models/lending');
const auth = require('../auth');

const router = express.Router();

router.get('/', (req, res, _) => {
  Lending.find()
    .select('_id lender bikeId time')
    .then((lendings) => {
      res.status(200)
        .json(lendings);
    })
    .catch((error) => {
      res.status(500)
        .json({
          error,
        });
    });
});

router.get('/:lendingId', (req, res, _) => {
  Lending.findOne({
    _id: req.params.lendingId,
  })
    .select('_id lender bikeId time')
    .then((lending) => {
      res.status(200)
        .json(lending);
    })
    .catch((error) => {
      res.status(500)
        .json({
          error,
        });
    });
});

router.post('/', (req, res, _) => {
  Lending.find()
    .then((lendings) => {

      if (req.body.bikeId === undefined) {
        return res.status(400).json({
          message: 'Where\'s my bikeId!'
        });
      }

      const lendingsInUse = lendings.filter((lending) => {
        if (lending.bikeId === new String(req.body.bikeId).valueOf()) {
          // Epoch 0 means that the bike is in use
          if (new Date(lending.time.returned).getTime() === new Date(0).getTime()) {
            // Gets trapped in the filter
            return true;
          }
        }
        return false;
      });
      console.log(lendingsInUse);

      if (lendingsInUse.length !== 0) {
        return res.status(409).json({
          message: 'The bike is in use!',
        });
      }

      const lending = new Lending({
        _id: new mongoose.Types.ObjectId(),
        lender: req.body.lender,
        bikeId: req.body.bikeId,
      });
      lending.save()
        .then((result) => {
          res.status(200)
            .json({
              ...result,
              message: 'Lending successful',
            });
        })
        .catch((error) => {
          res.status(500)
            .json({
              ...error,
              message: 'Lending failed!',
            });
        });
    })
    .catch((error) => {

    });
});

router.patch('/:lendingId', (req, res, _) => {
  Lending.findOne({
    _id: req.params.lendingId,
  })
    .then((lending) => {
      Lending.update(lending, req.body)
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
