const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for Users
const GlobalOfferSchema = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  body: {
    type: Object,
    required: true,
  },
  date: {
    type: String,
    default: Date.now,
  },
});

const GlobalOffer = mongoose.model('global_offers', GlobalOfferSchema);

module.exports = GlobalOffer;
