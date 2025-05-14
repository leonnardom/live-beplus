const { Schema} = require('mongoose');

module.exports = new Schema({
  // <---------- ID ----------> \\

  _id: { type: String },

  // <---------- Prefix ----------> \\

  prefix: { type: String, default: process.env.PREFIX },


});
