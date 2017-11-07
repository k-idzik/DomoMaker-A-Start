// Middleware in Expresss is used for injecting code calls between other calls
// Can be used for request redirection

// Checks if the user is logged in, redirects to homepage otherwise
const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }

  return next();
};

// Checks if the user is already logged in, redirects to the app if they are
const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/maker');
  }

  return next();
};

// If this process should be secure, check for HTTPS
// Heroku is encrypted internally, so it always will be true
// Instead, check the forwarded request in the "x-forwarded-proto" header
// Bypass this check for local testing
const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }

  return next();
};

const bypassSecure = (req, res, next) => {
  next();
};

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

// Change security requirement depending on environment
// On Heroku, the config var 'production' must be added
if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
