const { Schema } = require('mongoose');

module.exports = new Schema({
  // <---------- ID ----------> \\

  _id: { type: String },

  // <---------- Usages ----------> \\

  usages: { type: Number, default: 0 },

  // <---------- Maintenance ----------> \\

  maintenance: {
    status: { type: Boolean, default: false },
    reason: { type: String, default: null }
  }
});
