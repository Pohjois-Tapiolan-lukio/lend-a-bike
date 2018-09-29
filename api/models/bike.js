const mongoose = require('mongoose');

const bikeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  bikeNumber: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Bike', bikeSchema);

// vim: et sw=2 ts=2 :
