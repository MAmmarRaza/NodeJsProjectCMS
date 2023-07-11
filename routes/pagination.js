// paginationHelper.js

const paginateResults = async (model, query, currentPage, pageSize) => {
    const totalResultsCount = await model.countDocuments(query); // Get the total count of records
    const totalPages = Math.ceil(totalResultsCount / pageSize); // Calculate the total number of pages
  
    const results = await model
      .find(query)
      .skip((currentPage - 1) * pageSize) // Calculate the number of records to skip based on the current page
      .limit(pageSize); // Limit the number of records per page
  
    return {
      results,
      totalPages,
      currentPage
    };
  };
  
  module.exports = { paginateResults };
  