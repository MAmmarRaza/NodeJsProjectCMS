// sessionFilter.js

const session = require('express-session');
const cookieParser = require('cookie-parser');

const sessionExistsMiddleware = (req, res, next) => {
  if (req.session && req.session.username) {
    // Session exists
    if (req.path === "/" || req.path === "/login") {
      // If accessing login page or login route and session exists, redirect to a different route
      res.redirect("/admin/post");
    } else {
      // Allow access to other routes
      next();
    }
  } else {
    // Session doesn't exist
    if (req.path === "/" || req.path === "/login") {
      // If accessing login page or login route and session doesn't exist, proceed to the route
      next();
    } else {
      // Redirect to login page for other routes
      res.redirect("/admin");
    }
  }
};

const restrictAccessMiddleware = (req, res, next) => {
  if (req.session.userrole === 0 && req.path !== '/post' && req.path !== '/add-post' && req.path !== '/save-post' && req.path !== '/delete-post' && req.path !== '/edit-post' && req.path !== '/update-post') {
    res.redirect("/404"); // Redirect to 404 page
  } else {
    next(); // User has access, continue to the next middleware or route handler
  }
};

// const restrictAccessMiddleware = (req, res, next) => {
//   if (req.session.userrole === 0 ) {
//     res.redirect("/404"); // Redirect to 404 page
//   } else {
//     next(); // User has access, continue to the next middleware or route handler
//   }
// };

const configureMiddlewares = (app) => {
  // Configure session middleware
  const oneHour = 1000 * 60 * 60;
  app.use(
    session({
      secret: "thisismysecrectkey",
      saveUninitialized: true,
      cookie: { maxAge: oneHour },
      resave: false
    })
  );

  // Cookie parser middleware
  app.use(cookieParser());

  // Middleware function to add session variables to response locals
  app.use((req, res, next) => {
    res.locals.username = req.session.username;
    res.locals.userrole = req.session.userrole;
    next();
  });
};

module.exports = {
  sessionExistsMiddleware,
  restrictAccessMiddleware ,
  configureMiddlewares
};
