const { Router } = require('express');

const authRouter = Router();
const Models = require('../model');

authRouter.post('/login', async (req, res) => {
  const { body: { username, password } } = req;
  console.log(username, password);

  const user = await Models.User.getAuthenticated(username, password);
  console.log(user);

  if (!user) {
    res.status(401);
    res.json({
      msg: 'Error',
    });
    res.end();
  }

  const responseJson = {
    id: user.id,
    username: user.username,
    firstName: user.firstname,
    lastName: user.name,
    token: 'fake-jwt-token',
  };

  console.log(responseJson);

  res.status(200);
  res.json({ ok: true, user: responseJson });
  res.end();
});

module.exports = authRouter;
