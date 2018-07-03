// Module import by npm
const express = require('express');
const fs = require('fs');
// const _ = require('lodash');
const bodyParser = require('body-parser');
// const path = require('path');
const cors = require('cors');

const authRouter = require('./routes/auth');
const carRouter = require('./routes/car');
const userRouter = require('./routes/user');

// Connection a la base de donnée
const { connect } = require('./services/dbService');

// Module instance
const app = express();
const server = require('http').createServer(app);

// Router instance
const router = express.Router();

// init db connection
connect();

// const mongoDb = require('./db.js');
router.use(bodyParser.json());

// enable cross plateform protocol communication
router.use(cors(process.env.ORIGIN, { withCredentials: true }));

// a middleware function with no mount path. This code is executed for every request to the router
router.use((req, res, next) => {
  const date = new Date();
  console.log(`[Time]: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} - [Method]: ${req.method} [URL]: ${req.url} - [Mode]: ${req}`);
  // console.log(req);

  // enable cross plateform protocol communication
  // res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// redirection des actions vers les routeurs concernées
router.use('/auth', authRouter);
router.use('/', userRouter);
router.use('/', carRouter);

// path de redirection par defautl
router.get('/', (req, res) => {
  fs.readFile('./', 'utf-8', (error, content) => {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    res.end(content);
  });
});

// mount the router on the app
app.use('/', router);

// define listening port of server
server.listen(3030);
console.log('App Launched on post 3030 ');
