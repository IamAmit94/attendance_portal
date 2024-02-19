const mongoose = require('mongoose');
const { Schema } = mongoose;

// const inOutSchema = new mongoose.Schema({
//   instructorId: { type: String, required: true },
//   checkInTime: { type: Date, required: true },
//   checkOutTime: { type: Date },
// });


const inOutSchema = new mongoose.Schema({
  instructorId: { type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true }, // Reference User model
  checkInTime: { type: Date, 
    required: true },
  checkOutTime: { type: Date },
});
module.exports = mongoose.model('InOut', inOutSchema);
