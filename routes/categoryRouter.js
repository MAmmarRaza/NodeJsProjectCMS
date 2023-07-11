const express = require('express');
const categories = require('../db/catModel');
const posts = require('../db/postModel');
// const { restrictAccessMiddleware  } = require('../middleware/sessionFilter');
const categoryRouter = express.Router();

categoryRouter.get('/category', async (req, res) => {
    try {
        const result = await categories.find(); // Retrieve all records from the "students" collection
        res.render('admin/category', { result: result });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the records.' });
    }
});

categoryRouter.get('/add-category', (req, res) => {
    res.render('admin/add-category');
});

categoryRouter.post('/save-category', async (req, res) => {
    const data = new categories({
        name: req.body.name,
        posts: 0
    });
    data.save()
        .then(() => {
            res.redirect('category');
        })
        .catch(error => {
            res.send(error);
        });
});


categoryRouter.get('/update-category', async (req, res) => {
    const cat_id = req.query.cat_id;
    try {
        const result = await categories.find({ _id: cat_id }); // Retrieve all records from the "students" collection
        res.render('admin/update-category', { result: result[0] });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the records.' });
    }
});

categoryRouter.post("/edit-category", async (req, res) => {
    // console.log(req.body);
    try {
        const cat_id = req.body.cat_id;
        await categories.updateOne(
            { _id: cat_id },
            {
                $set: req.body
            });
        res.redirect("category")
        // console.log(res.find(cat_id));
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating Record' });
    }
});


categoryRouter.get('/delete-category', async (req, res) => {
    const id = req.query.cat_id;
    try {
        // Find the category by ID
        const category = await categories.findById(id);

        // Delete all posts associated with the category
        await posts.deleteMany({ category: category.name })
        //Delete Category
        await categories.findByIdAndDelete(id);
        res.redirect("category");
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the record.' });
    }
});
// route.use()
// categoryRouter.use(restrictAccessMiddleware );
module.exports = categoryRouter;