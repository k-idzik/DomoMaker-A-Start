// Import libraries
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const csrf = require('csurf'); // Prevent Cross-Site-Request-Forgery

const port = process.env.PORT || process.env.NODE_PORT || 3000; // Node server connection

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/DomoMaker'; // MongoDB database connection

// Connect to the database
mongoose.connect(dbURL, (err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

// Get the username/password to connect to Redis, or assume this is a local machine
let redisURL = {
  hostname: 'localhost',
  port: 6379,
};

let redisPASS;

if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  redisPASS = redisURL.auth.split(':')[1];
}

// Pull in the router
const router = require('./router.js');

const app = express();
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.disable('x-powered-by'); // Disable this so others don't know what framework we're running
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  key: 'sessionid', // Rename this from the default "connect.sid"
  store: new RedisStore({ // Instead of storing in server variables, store in Redis
    host: redisURL.hostname,
    port: redisURL.port,
    pass: redisPASS,
  }),
  secret: 'Domo Arigato', // Seed for hashing/unique session keys
  resave: true, // Refresh the key to keep it active
  saveUninitialized: true, // Always make sessions even when not logged in
  cookie: {
    httpOnly: true, // Prevent client side JavaScript from accessing cookies
  },
}));
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views/`);
app.use(cookieParser());

// Don't respond to users with a bad token
// They're up to nonsense
app.use(csrf()); // Must come after cookieParser and session, but before router
app.use((err, req, res, next) => {
  // If this isn't tomfoolery
  if (err.code !== 'EBADCSRFTOKEN') {
    return next(err);
  }

  console.log('Missing CSRF token');
  return false;
});

router(app);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
