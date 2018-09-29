const mongoose = require('mongoose');

const lendingSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  lender: {
    type: String,
    required: true,
  },
  bikeNumber: {
    type: Number,
    required: true,
  },
  bike_id: mongoose.Schema.Types.ObjectId,
  time: {
    lent: {
      type: Date,
      default: Date.now,
    },
    returned: {
      type: Date,
      default: 0,
    },
  },
});

module.exports = mongoose.model('Lending', lendingSchema);

// vim: et sw=2 ts=2 :
