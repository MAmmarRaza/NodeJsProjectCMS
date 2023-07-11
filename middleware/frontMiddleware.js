const posts = require('../db/postModel');
const categories = require('../db/catModel');
const users = require('../db/userModel');


// Define a middleware function to set the sidebar data
const setSidebarData = async (req, res, next) => {
  try {
    const result = await posts.find().limit(3); // Retrieve 3 records from the "posts" collection
    res.locals.sidebarData = result;
    next();
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the records.' });
  }
};

// Define a middleware function to set the sidebar data
const setHeaderData = async (req, res, next) => {
    try {
      const result = await categories.find(); // Retrieve all records from the "posts" collection
      res.locals.headerData = result;
      next();
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while retrieving the records.' });
    }
  };

module.exports = {
    setHeaderData,
    setSidebarData
};