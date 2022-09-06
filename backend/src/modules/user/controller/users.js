import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import Users from '../../../models/mongoDB/users';
import GameMember from '../../../models/mongoDB/gameMember';
import constants from '../../../utils/constants';
import config from '../../../../config';


/**
 * Login user and send auth token and user details in response.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.loginUser = async (req, res) => {
	try {
		var user

		var isAuth = false
		user = await Users.findOne({
			userUID: req.body.userUID
		})

		if (user.isActive) {
			return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(user)
		} else if (!user.isActive) {
			return res.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS).send("USER_INACTIVE")
		} else {
			let userObj = {
				userUID: req.body.userUID,
				userName: req.body.userName,
				email: req.body.email
			}
			let newUser = new Users(userObj)
			let createdUser = await newUser.save()
			return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(createdUser)
		}
	} catch (error) {
		console.log(`Error while logging in user ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Get user profile details based on userid.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getUserProfile = async (req, res) => {
	try {

		if (req.params.userId == "null") {
			return res.status(204).json()
		}

		let details = await Users.findById(req.params.userId)
		if (details) {
			details = details.toJSON()
			delete details.password
			return res.status(200).send(details)
		} else {
			return res.status(204).json()
		}
	} catch (error) {
		console.log(`Error while getting user profile details ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Update user details based on userid.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.updateUserProfile = async (req, res) => {

	try {

		const user = await Users.findOne({
			userUID: {
				$ne: req.body.userUID
			},
			userName: req.body.newUserName
		})
		if (user) {
			return res
				.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send(constants.MESSAGES.USER_ALREADY_EXISTS)
		}

		let userObj = await Users.findOne({
			userUID: req.body.userUID
		})

		if (!userObj) {
			return res.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS).send("USER_NOT_FOUND")
		}

		let details = await Users.findOneAndUpdate(
			{
				userUID: req.body.userUID
			},
			{
				userName: req.body.newUserName
			}
		)
		let gameMembers = await GameMember.find({
			userId: userObj._id
		})
		for (var game of gameMembers) {
			await GameMember.findByIdAndUpdate(
				game._id,
				{
					userName: req.body.newUserName
				}
			)
		}
		return res.status(200).send(details.toJSON())

	} catch (error) {
		console.log(`Error while updating user profile details ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}


/**
 * Update user details based on userid.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.sendMessage = async (req, res) => {

	try {
		let user = await Users.findOne({userUID: req.body.userUID})
		console.log(user)
		if (!user) {
			return res
				.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
				.send("Not a valid user")
		}

		let transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			// service: 'gmail',
			auth: {
				user: config.nodemailer.EMAIL_ID,
				pass: config.nodemailer.APP_PASSWORD,
			},
		});

		transporter.sendMail({
			from: config.nodemailer.EMAIL_ID,
			to: "jayasurya1796@gmail.com",
			subject: "A new message from declare game",
			// text: "Hello world?", 
			html: `<p><b>Email address: </b>${req.body.email}</p><p><b>Username: </b>${req.body.userName}</p><p>${req.body.description}</p>`
		});

		// transporter.sendMail({
		// 	from: config.nodemailer.EMAIL_ID,
		// 	to: req.body.email,
		// 	subject: "We have received your bug report",
		// 	// text: "Hello world?", 
		// 	html: `<p>Thank you for reporting. We will work on it as soon as possible. 
		// 	The good thing about this game is that you can create as many accounts as you wish. 
		// 	So if your game is not responding, we're sorry about it but please logout and create a new 
		// 	account to play more games</p><p><b>Your description of the bug</b></p><p>${req.body.description}</p>`,
		// 	attachments: attachments
		// });

		return res.status(200).send(null)

	} catch (error) {
		console.log(`Error while reporting bug ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}


/**
 * Get user profile details based on userid.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getStats = async (req, res) => {
	try {

		let user = await Users.findById(
			mongoose.Types.ObjectId(req.params.userId)
		)

		if (!user) {
			return res
				.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
				.send("User does not exist")
		}

		const returnValue = {
			gamesCount: user.totalGames,
			totalWins: user.totalWins,
			totalDeclares: user.totalDeclares,
			totalFifties: user.totalFifties,
			totalPairs: user.totalPairs,
		}

		return res
			.status(constants.STATUS_CODE.SUCCESS_STATUS)
			.send(returnValue)

	} catch (error) {
		console.log(`Error while getting stats ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Get leaderboard for all users.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.leaderboard = async (req, res) => {
	try {

		let allUsers = await Users.find(),
			user,
			userId,
			allUsersData = []


		for (user of allUsers) {
			userId = user._id

			allUsersData.push({
				userId: userId,
				userName: user.userName,
				gamesCount: user.totalGames,
				totalWins: user.totalWins,
				totalDeclares: user.totalDeclares,
				totalFifties: user.totalFifties,
				totalPairs: user.totalPairs,
			})
		}

		return res
			.status(constants.STATUS_CODE.SUCCESS_STATUS)
			.send(allUsersData)

	} catch (error) {
		console.log(`Error while getting getAllUsers ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}


/**
 * Get all users.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.allUsers = async (req, res) => {
	try {

		let data = await Users.find()
		let returnValue = []

		for (var user of data) {
			returnValue.push({
				userId: user._id,
				userName: user.userName
			})
		}

		return res
			.status(constants.STATUS_CODE.SUCCESS_STATUS)
			.send(returnValue)

	} catch (error) {
		console.log(`Error while getting getAllUsers ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}