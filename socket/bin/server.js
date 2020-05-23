import cors from 'cors';
import config from '../config/index';

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { port } = config;

// database connections
require('../src/models/mongoDB/index');

//Whenever someone connects this gets executed
io.on('connection', function (client) {
	console.log('A user connected');

	client.on('getValue', (interval) => {
		console.log('client is subscribing to timer with interval ', interval);
		client.emit('result', "Connected")
	});

	//Whenever someone disconnects this piece of code executed
	client.on('disconnect', function () {
		console.log('A user disconnected');
	});
});


// use cors to allow cross origin resource sharing
app.use(cors({ origin: '*', credentials: false }));
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
	);
	res.setHeader('Cache-Control', 'no-cache');
	next();
});

http.listen(config.port, () => console.log(`Game socket server listening on ${port}`));
module.exports = app;
