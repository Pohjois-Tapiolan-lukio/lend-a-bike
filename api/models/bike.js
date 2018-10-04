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
  image: {
    file: mongoose.Schema.Types.Mixed,
    uploaded: { type: Date },
  },
});

// bikeSchema.pre('save', function preSave(next) {
//   this.image.uploaded = new Date();
//   console.log(this.imape.uploaded);
//   next();
// });

module.exports = mongoose.model('Bike', bikeSchema);

// vim: et sw=2 ts=2 :
