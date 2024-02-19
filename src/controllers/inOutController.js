const InOut = require('../models/inOutModel');
// const { validateDateTime } = require('../../middlewares/validation');
const jwt = require('jsonwebtoken');
const {User} = require('../models/user');

const checkIn = async (req, res) => {
  const token = req.header('Authorization');
  // Check if the user exists
  try {
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
    const userIdData = decoded._id;
    console.log(`userIdData===>`,userIdData);
    const user = await User.findById(userIdData);

    if (!user) {
      return res.status(404).json({ error: 'User not found. Please sign up first.' });
    }

    const { date, time } = req.body;
    const userId = userIdData;

    // If date is provided, use it; otherwise, use the current date
    const checkInDate = date ? new Date(date) : new Date();

    // If time is provided, set the time on the check-in date; otherwise, use the current time
    if (time) {
      const [hours, minutes] = time.split(':');
      checkInDate.setHours(Number(hours), Number(minutes), 0, 0);
    }

    const inOutEntry = new InOut({ instructorId: userId, checkInTime: checkInDate });
    await inOutEntry.save();

    res.status(201).json({ message: 'Check-in recorded successfully' });
  } catch (error) {
    console.error('Error recording check-in', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const checkOut = async (req, res) => {
  const token = req.header('Authorization');
  try {
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
    const userIdData = decoded._id;
    console.log(`checkout ===>`, userIdData);
    const user = await User.findById(userIdData);

    if (!user) {
      return res.status(404).json({ error: 'User not found. Please sign up first.' });
    }
    const userId = userIdData;

    const { date, time } = req.body;

    // If date is provided, use it; otherwise, use the current date
    const checkOutDate = date ? new Date(date) : new Date();

    // If time is provided, set the time on the check-out date; otherwise, use the current time
    if (time) {
      const [hours, minutes] = time.split(':');
      checkOutDate.setHours(Number(hours), Number(minutes), 0, 0);
    }

    // Check if there is any check-in within the last 24 hours
    const existingEntry = await InOut.findOne({
      instructorId: userId,
      checkOutTime: { $exists: true },
      checkOutTime: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // within the last 24 hours
    });

    if (existingEntry) {
      return res.status(400).json({ error: 'User has already checked out, duplicate checkout' });
    }

    const inOutEntry = await InOut.findOneAndUpdate(
      { instructorId: userId, checkOutTime: { $exists: false } },
      { checkOutTime: checkOutDate },
      { new: true }
    );

    if (!inOutEntry) {
      return res.status(404).json({ error: 'No matching check-in found' });
    }

    res.status(200).json({ message: 'Check-out recorded successfully' });
  } catch (error) {
    console.error('Error recording check-out', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// API to fetch all the checkin of the user
const getCheckIns = async (req, res) => {
  const { userId } = req.params;

  try {
    const checkIns = await InOut.find({ instructorId: userId, checkOutTime: { $exists: false } });

    if (checkIns.length === 0) {
      return res.status(404).json({ error: 'No check-ins found for the user' });
    }

    res.status(200).json(checkIns);
  } catch (error) {
    console.error('Error fetching check-ins', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// API to fetch all the checkout of the use

const getCheckOuts = async (req, res) => {
  const { userId } = req.params;

  try {
    const checkOuts = await InOut.find({ instructorId: userId, checkOutTime: { $exists: true } });

    if (checkOuts.length === 0) {
      return res.status(404).json({ error: 'No check-outs found for the user' });
    }

    // Calculate total log time
    let totalLogTimeInMilliseconds = 0;
    const formattedCheckOuts = checkOuts.map(checkOut => {
      const checkInTime = new Date(checkOut.checkInTime);
      const checkOutTime = new Date(checkOut.checkOutTime);
      const logTimeInMilliseconds = checkOutTime - checkInTime;

      totalLogTimeInMilliseconds += logTimeInMilliseconds;

      return {
        _id: checkOut._id,
        instructorId: checkOut.instructorId,
        checkInTime: checkOut.checkInTime,
        checkOutTime: checkOut.checkOutTime,
        logTime: formatMilliseconds(logTimeInMilliseconds)
      };
    });

    // Format total log time in hours and minutes
    const formattedTotalLogTime = formatMilliseconds(totalLogTimeInMilliseconds);

    res.status(200).json({ checkOuts: formattedCheckOuts, totalLogTime: formattedTotalLogTime });
  } catch (error) {
    console.error('Error fetching check-outs', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Helper function to format milliseconds into hours and minutes
function formatMilliseconds(milliseconds) {
  const minutes = Math.floor(milliseconds / (1000 * 60));
  const hours = Math.floor(minutes / 60);

  const formattedTime = `${hours} hours ${minutes % 60} minutes`;
  return formattedTime;
}



module.exports = { checkIn, checkOut, getCheckIns, getCheckOuts };
