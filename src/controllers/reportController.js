const InOut = require('../models/inOutModel');

const getMonthlyReport = async (req, res) => {
  const { instructorId, startDate, endDate } = req.params;

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    return res.status(400).json({ error: 'Invalid date format for startDate/endDate. Use yy-mm-dd format.' });
  }

  const isoStartDate = new Date(startDate).toISOString();
  const isoEndDate = new Date(endDate).toISOString();

  try {
    const monthlyRecords = await InOut.find({
      instructorId,
      checkInTime: { $gte: new Date(isoStartDate), $lt: new Date(isoEndDate) },
    });

    if (monthlyRecords.length === 0) {
      return res.status(404).json({ error: 'No data found for the specified month' });
    }

    // Group records by date
    const dailyRecords = groupRecordsByDate(monthlyRecords);

    // Calculate total checked-in time for each day
    const dailyTotalTimes = calculateDailyTotalTimes(dailyRecords);

    const formattedRecords = dailyRecords.map((recordsForDay, index) => ({
      date: recordsForDay[0].checkInTime.toISOString().split('T')[0], // Extract date part
      checkInTime: recordsForDay[0].checkInTime,
      checkOutTime: recordsForDay[0].checkOutTime || null,
      totalLoggedTime: formatMilliseconds(dailyTotalTimes[index]),
    }));

    res.status(200).json({ records: formattedRecords });
  } catch (error) {
    console.error('Error fetching monthly report', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Helper function to group records by date
const groupRecordsByDate = (records) => {
  const groupedRecords = new Map();
  records.forEach((record) => {
    const dateKey = record.checkInTime.toISOString().split('T')[0]; // Extract date part
    if (!groupedRecords.has(dateKey)) {
      groupedRecords.set(dateKey, []);
    }
    groupedRecords.get(dateKey).push(record);
  });
  return Array.from(groupedRecords.values());
};

// Helper function to calculate total checked-in time for each day
const calculateDailyTotalTimes = (dailyRecords) => {
  return dailyRecords.map((recordsForDay) => {
    let totalForDay = 0;
    recordsForDay.forEach((record) => {
      const checkInTime = record.checkInTime;
      const checkOutTime = record.checkOutTime || new Date(); // Use current time if check-out is not available
      totalForDay += checkOutTime.getTime() - checkInTime.getTime();
    });
    return totalForDay;
  });
};

// Helper function to format milliseconds into HH:mm:ss
const formatMilliseconds = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  return `${hours}:${minutes % 60}:${seconds % 60}`;
};

module.exports = { getMonthlyReport };
