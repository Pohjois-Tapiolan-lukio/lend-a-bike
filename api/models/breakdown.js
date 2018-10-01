const mongoose = require('mongoose');

const breakdownSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  reason: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  bikeNumber: {
    type: Number,
    required: true,
  },
  time: {
    broken: {
      type: Date,
      default: Date.now,
    },
    fixed: {
      type: Date,
      default: 0,
    },
  },
});

module.exports = mongoose.model('Breakdown', breakdownSchema);

// vim: et sw=2 ts=2 :
