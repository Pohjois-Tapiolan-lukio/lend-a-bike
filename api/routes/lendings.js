const express = require('express');
const mongoose = require('mongoose');

const Lending = require('../models/lending');
const auth = require('../auth');

const router = express.Router();

router.get('/', (req, res, _) => {
  console.log(req.query);
  Lending.find()
    .select('_id lender bikeNumber bike_id time')
    .then(lendings => {
      let body = lendings;
      if (req.query.filter === 'unreturned') {
        body = lendings.filter(
          lending =>
            new Date(lending.time.returned).getTime() === new Date(0).getTime()
        );
      } else if (req.query.filter === 'returned') {
        body = lendings.filter(
          lending =>
            new Date(lending.time.returned).getTime() !== new Date(0).getTime()
        );
      }
      res.status(200).json(body);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error,
      });
    });
});

router.get('/:lendingId', (req, res, _) => {
  Lending.findOne({
    _id: req.params.lendingId,
  })
    .select('_id lender bikeNumber bike_id time')
    .then(lending => {
      res.status(200).json(lending);
    })
    .catch(error => {
      res.status(500).json({
        error,
      });
    });
});

router.post('/', (req, res, _) => {
  Lending.find()
    .then(lendings => {
      if (req.body.bikeNumber === undefined || req.body.bike_id === undefined) {
        return res.status(400).json({
          message: 'BikeId and bike_id are required',
        });
      }

      const lendingsInUse = lendings.filter(lending => {
        if (lending.bikeNumber === new String(req.body.bikeNumber).valueOf()) {
          // Epoch 0 means that the bike is in use
          if (
            new Date(lending.time.returned).getTime() === new Date(0).getTime()
          ) {
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
        bikeNumber: req.body.bikeNumber,
        bike_id: req.body.bike_id,
      });
      lending
        .save()
        .then(result => {
          res.status(200).json({
            ...result,
            message: 'Lending successful',
          });
        })
        .catch(error => {
          res.status(400).json({
            ...error,
            message: 'Lending failed!',
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        error,
      });
    });
});

router.patch('/:lendingId', (req, res, _) => {
  Lending.findOne({
    _id: req.params.lendingId,
  })
    .then(lending => {
      Lending.update(lending, req.body)
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

router.patch('/return/:bike_id', (req, res) => {
  Lending.find({
    bike_id: req.params.bike_id,
  })
    .where('time.returned')
    .eq(0)
    .then(lendings => {
      if (lendings.length === 0) {
        return res.status(400).json({
          message: 'The bike is not lent',
        });
      }
      const lending = lendings[0];
      if (req.body.lender !== lending.lender) {
        return res.status(400).json({
          message: 'Wrong lender',
        });
      }
      Lending.update(lending, {
        $currentDate: {
          'time.returned': 'date',
        },
      })
        .then(result => {
          res.status(200).json(result);
        })
        .catch(error =>
          res.status(500).json({
            error,
          })
        );
    })
    .catch(error =>
      res.status(400).json({
        message: error,
      })
    );
});

module.exports = router;

// vim: et ts=2 sw=2 :
