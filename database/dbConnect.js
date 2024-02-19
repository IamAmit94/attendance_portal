// const mongoose = require('mongoose');

// const connectDatabase = async () => {
//   try {
//     await mongoose.connect('mongodb://localhost:27017/instructor-tracking', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('Connected to the database');
//   } catch (error) {
//     console.error('Error connecting to the database', error);
//     process.exit(1);
//   }
// };

// module.exports = connectDatabase;

const mongoose = require("mongoose");

module.exports = async () => {
    try {
        await mongoose.connect(process.env.DB);
        console.log("connected to database.");
    } catch (error) {
        console.log("could not connect to database", error);
    }
};