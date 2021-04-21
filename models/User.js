const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for Users
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  nonce: {
    type: String,
    allowNull: false,
    default: () => Math.floor(Math.random() * 1000000),
  },
  publicAddress: {
    type: String,
    required: true,
    unique: true,
    allowNull: false,
  },
  date: {
    type: String,
    default: Date.now,
  },
});

const User = mongoose.model('users', UserSchema);
module.exports = User;
