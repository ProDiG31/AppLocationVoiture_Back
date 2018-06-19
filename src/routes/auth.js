const { Router } = require('express');

const authRouter = Router();
const Models = require('../model/index');

// Load database Connection
require('../services/dbService');

authRouter.post('/login', (req, res) => {
  console.log('[POST] - Login Request Handle');
  //   console.log(JSON.stringify(req));

  const username = req.body.username;
  const password = req.body.password;

  // attempt to authenticate user
  Models.User.getAuthenticated(username, password, (err, user, reason) => {
    if (err) throw err;

    // login was successful if we have a user
    if (user) {
    // handle login success
      console.log('login success');
      res.write('Login OK');
      res.end();
    }

    // otherwise we can determine why we failed
    const reasons = Models.User.failedLogin;
    switch (reason) {
      case reasons.NOT_FOUND:
        console.log('Login Error Not found');
        res.write('Login Error Not found');
        res.end();
        break;
      case reasons.PASSWORD_INCORRECT:
        console.log('password false');
        res.write('password false');
        res.end();
        break;
      case reasons.MAX_ATTEMPTS:
        console.log('Max try attemps');
        res.write('Max try attemps');
        res.end();
        break;
      default:
        break;
    }
  });
});


module.exports = authRouter;
