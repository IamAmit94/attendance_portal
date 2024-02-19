const validateDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
  
    // Check if the date/time is valid and not NaN
    if (isNaN(dateTime.getTime())) {
      return false;
    }
  
    // Optionally, you can add more specific validations based on your requirements
    // For example, you can check if the date/time is in the future or restrict certain time ranges
  
    return true;
  };
  
  module.exports = { validateDateTime };
  