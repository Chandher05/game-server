import cors from 'cors';
import config from '../config/index';
// const config = require('../config/index');
// const cors = require('cors')('use strict');

const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// router for modules
const usersRouter = require('../src/modules/user/router/users');
const gameRouter = require('../src/modules/game/router/game');
const playerRouter = require('../src/modules/player/router/player');
const tournamentRouter = require('../src/modules/tournament/router/game');

// database connections
require('../src/models/mongoDB/index');

// cron job
require('../src/utils/endUnwantedGames')

// Update User module
require('../src/utils/updateUserModule')

const app = express();
const { port } = config;
const { frontendUrl } = config;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public/', express.static('./public/'));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

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


const admin = require('firebase-admin')
var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});



var checkAuth = async (req, res, next) => {
	try {
		let authHeader = req.headers.authorization
		let authToken = authHeader.substring(7, authHeader.length)
		console.log(authToken);
		let decodedToken = await admin.auth().verifyIdToken(authToken)
		const uid = decodedToken.uid;
		let userRecord = await admin.auth().getUser(uid)
		req.body.userUID = uid
		req.body.email = userRecord.email
		req.body.username = userRecord.displayName
		next()
	} catch (err) {
		res.status(403).send('Unauthorized')
	}
}

// base routes for modules
// app.use('/', checkAuth);
app.use('/users', usersRouter);
app.use('/game', gameRouter);
app.use('/player', playerRouter);
app.use('/tournament', tournamentRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));

});

// error handler
app.use((err, req, res) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

app.listen(config.port, () => console.log(`Game server listening on ${port}`));
module.exports = app;
