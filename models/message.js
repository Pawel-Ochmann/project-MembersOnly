const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const MessageSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

MessageSchema.virtual('date_formatted').get(function () {
  return DateTime.fromJSDate(this.date).toISODate();
});

module.exports = mongoose.model('Message', MessageSchema);
