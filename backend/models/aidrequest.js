const mongoose = require('mongoose');

const aidrequestSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: ''
  },
  priorityRating: {
    type: Number,
    default: 5
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

exports.AidRequest = mongoose.model('AidRequest', aidrequestSchema);