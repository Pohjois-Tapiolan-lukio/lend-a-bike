const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Admin = require('../models/admin');
const auth = require('../auth');

const router = express.Router();
const { JWT_KEY } = process.env;

router.post('/signup', (req, res, _) => {
  Admin.find({
    name: req.body.name,
  })
    .then(admins => {
      if (admins.length > 0) {
        res.status(409).json({
          message: 'Name already registered',
        });
        return;
      }
      bcrypt.hash(req.body.password, 10, (error, hash) => {
        if (error) {
          res.status(500).json({
            error,
          });
        } else {
          const admin = new Admin({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            password: hash,
          });
          admin
            .save()
            .then(result => {
              res.status(201).json(result);
            })
            .catch(saveError => {
              res.status(500).json({
                error: saveError,
              });
            });
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        error,
      });
    });
});

router.post('/login', (req, res, _) => {
  Admin.findOne({
    name: req.body.name,
  })
    .then(admin => {
      if (admin === undefined) throw new Error('Unauthorized');

      return bcrypt
        .compare(req.body.password, admin.password)
        .then(authorized => {
          if (!authorized) throw new Error('Unauthorized');

          const lastsForever = req.query.lastsForever === '1';
          const token = jwt.sign(
            {
              name: admin.name,
              userId: admin._id,
            },
            JWT_KEY,
            {
              expiresIn: lastsForever ? '365d' : '1h',
            }
          );

          res.status(200).json({
            token,
            userId: admin._id,
            message: 'Authentication successful',
            lastsForever,
          });
        });
    })
    .catch(error => {
      console.log(error);
      res.status(401).json({
        message: 'Authentication failed',
      });
    });
});

module.exports = router;

// vim: et ts=2 sw=2 :
