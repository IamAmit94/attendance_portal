const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  uniqueId: { type: String, required: true, unique: true },
  // Other instructor details if needed
});

module.exports = mongoose.model('Instructor', instructorSchema);
