const express = require('express');
const session = require('express-session');
require('./db/config');
const users= require("./db/userModel");
const userRouter = require('./routes/userRouter');
const categoryRouter = require('./routes/categoryRouter');
const postRouter = require('./routes/postRouter');
const frontRouter = require('./routes/frontRouter');
const cors=require('cors')
const { sessionExistsMiddleware , restrictAccessMiddleware, configureMiddlewares } = require('./middleware/sessionFilter');


const app = express();
app.use(cors(
  {
    origin:["https://node-js-project-cms.vercel.app", "https://blog-ammar-17ea7ba0a07b.herokuapp.com", "https://blog.exportthreads.live"],
    method:["POST","GET","PUT","DELETE"],
    credentials:true
    
  }
));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));
//apply session cookie middleware
configureMiddlewares(app);

// Apply sessionInitMiddleware before other routes
// app.use(sessionInitMiddleware);


app.post('/loginSession', async (req, res) => {
  if (req.body && req.body.username) {
    const user=await users.findOne({username:req.body.username,password:req.body.password});
    if(user){
      req.session.username = req.body.username;
      req.session.userrole=user.role;
      console.log(req.session.userrole);
      res.redirect("/admin/post");
    }else{
      res.render("admin",{error:"Username or Password incorrect!"});
    }
  } else {
    res.redirect("/admin");
  }
});

// Logout route
app.get('/admin/logout', (req, res) => {
  // Destroy the session and redirect to the login page
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/admin');
  });
});

app.use("/admin", sessionExistsMiddleware);
app.use("/admin",restrictAccessMiddleware, categoryRouter);
app.use("/admin", restrictAccessMiddleware, postRouter);
app.use("/admin",restrictAccessMiddleware, userRouter);
// app.use("/admin",categoryRouter);
// app.use("/admin", postRouter);
// app.use("/admin", userRouter);
app.use("/", frontRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
