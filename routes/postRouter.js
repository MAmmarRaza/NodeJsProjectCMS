const express = require('express');
const posts = require('../db/postModel');
const categories = require('../db/catModel');
// const {sessionExistsMiddleware}=require('../middleware/sessionFilter')
const postRouter = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { paginateResults } = require('./pagination');

async function changeNumber(table, find, column, operation) {
  const data = await table.findOne(find);
  let numbers = parseInt(data.posts);
  if (operation == "i") {
    numbers++;
  } else if (operation == "d") {
    numbers--;
  }

  console.log(numbers);
  const column_id = column;
  console.log(column_id);
  const UpdatedData = {
    posts: numbers
  };
  await categories.updateOne(
    { name: column_id },
    {
      $set: UpdatedData
    });
}

// Image //
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = path.join(__dirname, "../public/images");
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({
  storage: storage
});



postRouter.get("/post", async (req, res) => {
  const currentPage = parseInt(req.query.page) || 1; // Get the current page from the query parameters
  const pageSize = 10; // Define the number of records per page

  try {
    if (req.session.userrole == 0) {
      const { results, totalPages } = await paginateResults(posts, { author: req.session.username }, currentPage, pageSize);

      res.render('admin/post', {
        result: results,
        totalPages: totalPages,
        currentPage: currentPage
      });
    } else {
      const { results, totalPages } = await paginateResults(posts, {}, currentPage, pageSize);

      res.render('admin/post', {
        result: results,
        totalPages: totalPages,
        currentPage: currentPage
      });

    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the records.' });
  }

});

postRouter.get('/add-post', async (req, res) => {
  try {
    const cat_Result = await categories.find();
    res.render('admin/add-post', { result: cat_Result });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the records.' });
  }
});

postRouter.post('/save-post', upload.single("fileToUpload"), async (req, res) => {

  // save post data
  const data = new posts({
    title: req.body.post_title,
    category: req.body.category,
    author: req.session.username,
    post_img: req.file.filename,
    description: req.body.postdesc
  });
  data.save()
    .then(async () => {
      changeNumber(categories, { name: req.body.category }, req.body.category, "i");
      res.redirect('post');
    })
    .catch(error => {
      res.send(error);
    });
});


postRouter.get('/update-post', async (req, res) => {

  // update post
  const post_id = req.query.post_id;
  try {
    const post_result = await posts.find({ _id: post_id });
    const cat_Result = await categories.find();
    // console.log( cat_Result);
    res.render('admin/update-post', { result: post_result[0], result2: cat_Result });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the records.' });
  }
});

postRouter.post("/edit-post", upload.single("post_img"), async (req, res) => {
  //get previous category of post
  const previous_post_data = await posts.findOne({ _id: req.body.post_id });
  const previous_post_data_category = previous_post_data.category;

  try {
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category
      // Add any other fields you want to update
    };

    if (req.file && req.file.originalname) {
      const imagePath = path.join(__dirname, "../public/images", req.body.old_image);
      console.log(imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      updateData.post_img = req.file.originalname; // Add the updated image file name
    } else {
      updateData.post_img = req.body.old_image; // Keep the existing image file name
    }

    const post_id = req.body.post_id;
    posts.updateOne(
      { _id: post_id },
      {
        $set: updateData // Update the fields from the updateData object
      }
    )
      .then(async () => {
        console.log(previous_post_data_category);
        console.log(req.body.category);
        //if previous category is different from current
        if (req.body.category != previous_post_data_category) {
          //increment current
          changeNumber(categories, { name: req.body.category }, req.body.category, "i");
          //decrement previous
          changeNumber(categories, { name: previous_post_data_category }, previous_post_data_category, "d");
        }
        res.redirect("post");
      })
      .catch(error => {
        res.send(error);
      });

  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the record.' });
  }
});


postRouter.get('/delete-post', async (req, res) => {

  const id = req.query.post_id;
  try {
    // find id and delete image from folder
    const result = await posts.findById({ _id: id });
    const imagePath = path.join(__dirname, "../public/images", result.post_img);
    console.log(imagePath)
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    //find id and delete record
    posts.findByIdAndDelete(id)
      .then(async () => {
        //change post number
        changeNumber(categories, { name: req.query.category }, req.query.category, "d");
        res.redirect("post");
      })
      .catch(error => {
        res.send(error);
      })

  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the record.' });
  }
});

// postRouter.use(sessionExistsMiddleware);
module.exports = postRouter;