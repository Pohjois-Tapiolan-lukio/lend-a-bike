const express = require('express');
const mongoose = require('mongoose');

const Breakdown = require('../models/breakdown');
const auth = require('../auth');

const router = express.Router();

router.get('/', (req, res) => {
  Breakdown.find()
    .select('_id reason description bikeNumber time')
    .then(breakdowns => {
      res.status(200).json(breakdowns);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error,
      });
    });
});

router.get('/:breakdownId', (req, res) => {
  Breakdown.findOne({
    _id: req.params.breakdownId,
  })
    .select('_id reason description bikeNumber time')
    .then(breakdown => {
      res.status(200).json(breakdown);
    })
    .catch(error => {
      res.status(500).json({
        error,
      });
    });
});

router.post('/', auth, (req, res) => {
  /* if (req.body.bikeNumber === undefined) {
    return res.status(400).json({
      message: 'bikeNumber is required',
    });
  } */
  Breakdown.find({
    bikeNumber: req.params.bikeNumber,
  })
    .where('time.fixed')
    // Time 0 means not fixed
    .eq(0)
    .then(unFixedBreakdowns => {
      if (unFixedBreakdowns.length !== 0) {
        return res.status(409).json({
          message: 'The bike is already broken!',
        });
      }

      new Breakdown({
        _id: new mongoose.Types.ObjectId(),
        reason: req.body.reason,
        description: req.body.description,
        bikeNumber: req.body.bikeNumber,
      })
        .save()
        .then(result => {
          res.status(201).json({ ...result });
        })
        .catch(error => {
          res.status(400).json({ ...error });
        });
    })
    .catch(error => {
      res.status(500).json({
        error,
      });
    });
});

router.patch('/:breakdownId', auth, (req, res) => {
  Breakdown.findOne({
    _id: req.params.breakdownId,
  })
    .then(breakdown => {
      Breakdown.update(breakdown, req.body)
        .then(result => {
          res.status(200).json(result);
        })
        .catch(error => {
          res.status(500).json({ error });
        });
    })
    .catch(error => {
      res.status(400).json({ error });
    });
});

router.patch('/fix/:bikeNumber', auth, (req, res) => {
  Breakdown.find({
    bikeNumber: req.params.bikeNumber,
  })
    .where('time.fixed')
    .eq(0)
    .then(unFixedBreakdowns => {
      if (unFixedBreakdowns.length === 0) {
        return res.status(400).json({
          message: 'The bike is not broken',
        });
      }
      const breakdown = unFixedBreakdowns[0];
      Breakdown.update(breakdown, {
        $currentDate: {
          'time.fixed': 'date',
        },
      })
        .then(result => {
          res.status(200).json(result);
        })
        .catch(error =>
          res.status(500).json({ error })
        );
    })
    .catch(error =>
      res.status(400).json({ error })
    );
});

module.exports = router;

// vim: et ts=2 sw=2 :
