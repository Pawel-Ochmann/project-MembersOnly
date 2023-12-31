const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  secondName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isMembership:{
    type:Boolean,
    default:false
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

UserSchema.virtual('fullName').get(function () {
  return `${this.name} ${this.secondName}`;
});

module.exports = mongoose.model('User', UserSchema);
