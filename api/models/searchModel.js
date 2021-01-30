const mongoose = require('mongoose');

const { Schema } = mongoose;

const searchSchema = new Schema(
  {
    userId: {
      type: String,
      required: 'task1 cannot be blank'
    },
    
  },
  { collection: 'search' }
);

module.exports = mongoose.model('search', searchSchema);