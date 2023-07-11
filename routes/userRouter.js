const express= require('express');
const users= require('../db/userModel');
// const { sessionExistsMiddleware } = require('../middleware/sessionFilter');
const userRouter = express.Router();

userRouter.get('/', (req, res) => {
    res.render('admin/index');
});

userRouter.get('/users', async (req, res) => {
    try {
        const result = await users.find(); // Retrieve all records from the "students" collection
        res.render('admin/users', { result: result});
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the records.' });
      }
});

userRouter.get('/add-user', (req, res) => {
    res.render('admin/add-user');
});

userRouter.post('/save-user', async(req, res) => {
    const data = new users({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        role: req.body.role
    });
    data.save()
    .then(() => {
        res.redirect('users');
    })
    .catch(error => {
        res.send(error);
    });
});

userRouter.get('/update-user', async (req, res) => {
    const user_id = req.query.user_id;
    try {
        const result = await users.find({_id:user_id}); // Retrieve all records from the "students" collection
        res.render('admin/update-user', { result: result[0] });
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the records.' });
      }
});

userRouter.post("/edit-user", async (req, res) => {
    console.log(req.body);
    try {
        const user_id=req.body.user_id;
        await users.updateOne(
            { _id: user_id },
            {
                $set:req.body
            });
            res.redirect("users")
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating Record' });
      } 
});

userRouter.get('/delete-user', async (req, res) => {
    const id = req.query.user_id;
    try{
        await users.findByIdAndDelete(id);
        res.redirect("users");
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the record.' });
    }
});


// userRouter.use(sessionExistsMiddleware);
module.exports=userRouter;