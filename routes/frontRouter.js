const express = require('express');
const posts = require('../db/postModel');
const categories = require('../db/catModel');
const users = require('../db/userModel');
const { setHeaderData, setSidebarData }  = require('../middleware/frontMiddleware');
const { paginateResults } = require('./pagination');
const frontRouter = express.Router();

// using middleware
frontRouter.use(setSidebarData);
frontRouter.use(setHeaderData);


// route to get data at index file with pagination
frontRouter.get("/", async (req, res) => {
  const currentPage = parseInt(req.query.page) || 1; // Get the current page from the query parameters
  const pageSize = 10; // Define the number of records per page

  try {
    const { results, totalPages } = await paginateResults(posts, {}, currentPage, pageSize);

    res.render('index', {
      result: results,
      totalPages: totalPages,
      currentPage: currentPage
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the records.' });
  }
});

// route to get data at single  post file
frontRouter.get("/single",async (req,res)=>{
    const id=req.query.post_id;
    try {
        const result = await posts.find({ _id:id }); // Retrieve all records from the "posts" collection
        res.render('single', { result: result });
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the records.' });
      }
});




// route to get data at category post file
// frontRouter.get("/category",async (req,res)=>{
//   const catName=req.query.cat_name;
//   try {
//       const result = await posts.find({ category:catName }); // Retrieve all records from the "posts" collection
//       res.render('category', { result: result });
//     } catch (error) {
//       res.status(500).json({ error: 'An error occurred while retrieving the records.' });
//     }
// });

frontRouter.get("/category", async (req, res) => {
  const catName=req.query.cat_name;
  const currentPage = parseInt(req.query.page) || 1; // Get the current page from the query parameters
  const pageSize = 10; // Define the number of records per page

  try {
    const { results, totalPages } = await paginateResults(posts, { category:catName }, currentPage, pageSize);

    res.render('category', {
      result: results,
      totalPages: totalPages,
      currentPage: currentPage
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the records.' });
  }
});

// route to get data at category post file
// frontRouter.get("/author",async (req,res)=>{
//   const authName=req.query.author;
//   try {
//       const result = await posts.find({ author:authName }); // Retrieve all records from the "posts" collection
//       res.render('author', { result: result });
//     } catch (error) {
//       res.status(500).json({ error: 'An error occurred while retrieving the records.' });
//     }
// });

frontRouter.get("/author", async (req, res) => {
  const authName=req.query.author;
  const currentPage = parseInt(req.query.page) || 1; // Get the current page from the query parameters
  const pageSize = 10; // Define the number of records per page

  try {
    const { results, totalPages } = await paginateResults(posts,{ author:authName }, currentPage, pageSize);

    res.render('author', {
      result: results,
      totalPages: totalPages,
      currentPage: currentPage
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the records.' });
  }
});

// route to get data at category post file
// frontRouter.post("/search",async (req,res)=>{
//   const postName=req.body.search;
//   try {
//       const result = await posts.find({$or:[{ title: { $regex: `^${postName}`, $options: 'i' }},{ author: { $regex: `^${postName}`, $options: 'i' }}]});
//       res.render('search', { result: result, searchTerm:postName });
//     } catch (error) {
//       res.status(500).json({ error: 'An error occurred while retrieving the records.' });
//     }
// });

frontRouter.post("/search", async (req, res) => {
  const postName=req.body.search;
  const currentPage = parseInt(req.query.page) || 1; // Get the current page from the query parameters
  const pageSize = 10; // Define the number of records per page

  try {
    const { results, totalPages } = await paginateResults(posts,{$or:[{ title: { $regex: `^${postName}`, $options: 'i' }},{ author: { $regex: `^${postName}`, $options: 'i' }}]}, currentPage, pageSize);

    res.render('search', {
      result: results,
      totalPages: totalPages,
       searchTerm:postName,
      currentPage: currentPage
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the records.' });
  }
});

module.exports=frontRouter;