const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');
const { promisify } = require('util');

const Bike = require('../models/bike');
const auth = require('../auth');

const unlink = promisify(fs.unlink);

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images/');
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}_${file.originalname}`);
  },
});
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 20,
  },
  fileFilter: (req, file, cb) => {
    const match =
      file.mimetype === 'image/jpeg' || file.mimetype === 'image/png';
    if (match) {
      cb(null, true);
    } else {
      cb(new Error('Only jpeg and png files are allowed'), false);
    }
  },
});

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'File is missing!' });
  }
  Bike.findOne({
    bikeNumber: req.body.bikeNumber ? +req.body.bikeNumber : null,
  })
    .update({
      'image.file': req.file,
      'image.uploaded': new Date(),
    })
    .then(result => {
      if (result.n === 0) {
        res
          .status(400)
          .json({ error: { message: 'No bike has the given bikeNumber' } });
      } else {
        res.status(200).json(result);
      }
    })
    .catch(error => res.status(500).json(error));
});

router.delete('/:bikeNumber', auth, (req, res) => {
  Bike.findOne({ bikeNumber: req.params.bikeNumber })
    .then(bike => {
      if (bike.image && bike.image.file) {
        console.log(`Removing ${bike.image.file.path}`);
        unlink(bike.image.file.path);
      }
      delete bike.image;
      // Bike.update({ bikeNumber: req.params.bikeNumber }, { $unset: { image: '' } })
      bike.save();
    })
    .then(result => res.status(200).json(result))
    .catch(error => res.status(500).json({ error }));
});

module.exports = router;

// vim: et ts=2 sw=2 :
