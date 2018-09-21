const mongoose = require('mongoose');
const Lending = require('./lending');

const bikeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  bikeNumber: {
    type: String,
    required: true,
  },
  usage: {
    available: {
      type: Boolean,
      default: true,
    },
    //lendings: [
    //  Lending,
    //],
  },
});

module.exports = mongoose.model('Bike', bikeSchema);

// vim: et sw=2 ts=2 :
