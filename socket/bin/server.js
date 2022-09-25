import cors from 'cors';
import config from '../config/index';

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
	cors: {
	  origin: "*",
	  allowedHeaders: ["*"],
	  credentials: true
	}
  });
const { port } = config;

// database connections
require('../src/models/mongoDB/index');

// Cron job
require('../utils/cronJob')

// Socket Listener
import socketListener from '../src/modules/index'
socketListener(io)

// // use cors to allow cross origin resource sharing
// app.use(cors({ origin: '*', credentials: false }));
// app.use((req, res, next) => {
// 	res.setHeader('Access-Control-Allow-Origin', '*');
// 	res.setHeader('Access-Control-Allow-Credentials', 'true');
// 	res.setHeader('Access-Control-Allow-Methods', '*');
// 	res.setHeader(
// 		'Access-Control-Allow-Headers',
// 		'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
// 	);
// 	res.setHeader('Cache-Control', 'no-cache');
// 	next();
// });

http.listen(config.port, () => console.log(`Game socket server listening on ${port}`));
module.exports = app;
