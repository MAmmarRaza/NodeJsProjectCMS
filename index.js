const express = require('express');
const session = require('express-session');
require('./db/config');
const users = require("./db/userModel");
const userRouter = require('./routes/userRouter');
const categoryRouter = require('./routes/categoryRouter');
const postRouter = require('./routes/postRouter');
const frontRouter = require('./routes/frontRouter');
const cors = require('cors');
const axios = require('axios'); // Import axios for HTTP requests
const { sessionExistsMiddleware, restrictAccessMiddleware, configureMiddlewares } = require('./middleware/sessionFilter');

const app = express();

app.use(cors({
  origin: ["https://node-js-project-cms.vercel.app", "https://blog-ammar-17ea7ba0a07b.herokuapp.com", "https://blog.exportthreads.live"],
  method: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
}));

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));

// Apply session cookie middleware
configureMiddlewares(app);

// Fetch EC2 Instance ID
async function getInstanceId() {
  try {
    const response = await axios.get('http://169.254.169.254/latest/meta-data/instance-id');
    return response.data; // Return instance ID
  } catch (error) {
    console.error('Error retrieving instance ID:', error);
    return 'Error retrieving instance ID'; // Handle error
  }
}

// Create a route to display the instance ID in the browser
app.get('/instance-id', async (req, res) => {
  const instanceId = await getInstanceId();
  res.send(`Instance ID: ${instanceId}`);
});

app.post('/loginSession', async (req, res) => {
  if (req.body && req.body.username) {
    const user = await users.findOne({ username: req.body.username, password: req.body.password });
    if (user) {
      req.session.username = req.body.username;
      req.session.userrole = user.role;
      console.log(req.session.userrole);
      res.redirect("/admin/post");
    } else {
      res.render("admin", { error: "Username or Password incorrect!" });
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
app.use("/admin", restrictAccessMiddleware, categoryRouter);
app.use("/admin", restrictAccessMiddleware, postRouter);
app.use("/admin", restrictAccessMiddleware, userRouter);
app.use("/", frontRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
