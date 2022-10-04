import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import Users from '../../../models/mongoDB/users';
import Game from '../../../models/mongoDB/game';
import GameMember from '../../../models/mongoDB/gameMember';
import Messages from '../../../models/mongoDB/messages';
import constants from '../../../utils/constants';
import config from '../../../../config';

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

		if (!user) {
			let userObj = {
				userUID: req.body.userUID,
				userName: req.body.userName,
				email: req.body.email
			}
			let newUser = new Users(userObj)
			let createdUser = await newUser.save()
			return res.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS).send(createdUser)
		} else if (user.isActive) {
			return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(user)
		} else if (!user.isActive) {
			return res.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS).send({ msg: "USER_INACTIVE" })
		}
	} catch (error) {
		console.log(`Error while logging in user ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send({ msg: error.message })
	}
}

/**
 * Get user profile details based on userid.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getUserProfile = async (req, res) => {
	try {

		let details = await Users.findOne({
			userUID: req.body.userUID
		})
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
			.send({ msg: error.message })
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
				.send({ msg: constants.MESSAGES.USER_ALREADY_EXISTS })
		}

		let userObj = await Users.findOne({
			userUID: req.body.userUID
		})

		if (!userObj) {
			return res.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS).send({ msg: "USER_NOT_FOUND" })
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
		return res.status(200).send({ msg: "USER_UPDATED" })

	} catch (error) {
		console.log(`Error while updating user profile details ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send({ msg: error.message })
	}
}


/**
 * Update user details based on userid.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.sendMessage = async (req, res) => {

	try {
		let user = await Users.findOne({ userUID: req.body.userUID })

		if (!user) {
			return res
				.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
				.send({ msg: "Not a valid user" })
		}

		transporter.sendMail({
			from: config.nodemailer.EMAIL_ID,
			to: config.adminEmail,
			subject: "A new message from declare game",
			// text: "Hello world?", 
			html: `<p><b>Email address: </b>${req.body.email}</p><p>${req.body.description}</p>`
		});

		let messageObj = {
			userUID: req.body.userUID,
			email: req.body.email,
			subject: "A message from user",
			body: req.body.description
		}
		let newMessage = new Messages(messageObj)
		await newMessage.save()

		return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send({})

	} catch (error) {
		console.log(`Error while reporting bug ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send({ msg: error.message })
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
				.send({ msg: "User does not exist" })
		}

		const returnValue = {
			userName: user.userName,
			totalGames: user.totalGames,
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
			.send({ msg: error.message })
	}
}

/**
 * Get leaderboard for all users.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.leaderboard = async (req, res) => {
	try {

		let allUsers = await Users.find({
			isActive: true
		}).sort('userName')

		let user,
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
				requestedUser: req.body.userUID == user.userUID
			})
		}

		return res
			.status(constants.STATUS_CODE.SUCCESS_STATUS)
			.send(allUsersData)

	} catch (error) {
		console.log(`Error while getting getAllUsers ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send({ msg: error.message })
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
			.send({ msg: error.message })
	}
}


/**
 * Get all users.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.userStatus = async (req, res) => {
	try {

		let reqUserObj = await Users.findOne({
			userUID: req.body.userUID
		})
		if (!reqUserObj) {
			return res
				.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send({ msg: "User not found in database" })
		}
		if (!reqUserObj.isActive) {
			return res
				.status(constants.STATUS_CODE.SUCCESS_STATUS)
				.send({
					status: "INACTIVE",
					gameId: null
				})
		}

		req.body.userId = reqUserObj._id
		let timestamp = Date.now() - 1000 * 90

		let endedGame = await Game.findOne({
			$or: [{ players: req.body.userId }, { waiting: req.body.userId }, { spectators: req.body.userId }],
			isEnded: true,
			lastPlayedTime: {
				$gte: timestamp
			}
		})

		if (endedGame) {
			return res
				.status(constants.STATUS_CODE.SUCCESS_STATUS)
				.send({
					status: "GAME_ROOM",
					gameId: endedGame.gameId
				})
		}
		let inProgressGame = await Game.findOne({
			$or: [{ players: req.body.userId }, { waiting: req.body.userId }, { spectators: req.body.userId }],
			isEnded: false
		})

		if (!inProgressGame) {
			return res
				.status(constants.STATUS_CODE.SUCCESS_STATUS)
				.send({
					status: "NOT_PLAYING",
					gameId: null
				})
		} else if (inProgressGame.isStarted) {
			return res
				.status(constants.STATUS_CODE.SUCCESS_STATUS)
				.send({
					status: "GAME_ROOM",
					gameId: inProgressGame.gameId
				})
		}

		return res
			.status(constants.STATUS_CODE.SUCCESS_STATUS)
			.send({
				status: "LOBBY",
				gameId: inProgressGame.gameId
			})

	} catch (error) {
		console.log(`Error while getting getAllUsers ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send({ msg: error.message })
	}
}


/**
 * Get all users.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.userNames = async (req, res) => {
	try {

		let allUsers = await Users.find({
			isActive: true
		})

		let listOfUserNames = []
		for (var obj of allUsers) {
			listOfUserNames.push(obj.userName)
		}

		return res
			.status(constants.STATUS_CODE.SUCCESS_STATUS)
			.send(listOfUserNames.sort())

	} catch (error) {
		console.log(`Error while getting getAllUsers ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send({ msg: error.message })
	}
}


/**
 * Get all users.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.reportUser = async (req, res) => {
	try {

		if (req.params.userId == "null") {
			return res.status(204).json()
		}

		let userObj1 = await Users.findById(req.params.userId)

		if (!userObj1) {
			return res
				.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
				.send({ msg: "Invalid user ID" })
		}

		transporter.sendMail({
			from: config.nodemailer.EMAIL_ID,
			to: config.adminEmail,
			subject: "User reported in declare game",
			// text: "Hello world?", 
			html: `<p><b>By email address: </b>${req.body.email}</p><p><b>Reported user: </b>${userObj1.userName}</p>`
		});

		transporter.sendMail({
			from: config.nodemailer.EMAIL_ID,
			to: req.body.email,
			subject: "You have reported an user on declare game",
			html: `<p><b>Reported user: </b>${userObj1.userName}</p><p><b>Total games: </b>${userObj1.totalGames}</p>`
		});

		let messageObj = {
			userUID: req.body.userUID,
			email: req.body.email,
			subject: `Reported User`,
			body: `User ID: ${req.params.userId} || Reported user: ${userObj1.userName}`
		}
		let newMessage = new Messages(messageObj)
		await newMessage.save()

		return res
			.status(constants.STATUS_CODE.SUCCESS_STATUS)
			.send({ msg: "Request sent" })


	} catch (error) {
		console.log(`Error while getting getAllUsers ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send({ msg: error.message })
	}
}


/**
 * Get all users.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.claimOldUsername = async (req, res) => {
	try {


		const currentUserName = req.body.currentUserName
		const oldUserName = req.body.oldUserName
		const newUserName = req.body.newUserName

		if (newUserName != currentUserName && newUserName != oldUserName) {
			return res
				.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
				.send({ msg: "New username has to either current or old username" })
		}

		console.log(req.body)
		if (currentUserName == oldUserName) {
			return res
				.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
				.send({ msg: "Old username cannot be same as current username" })
		}
		let userObj1 = await Users.findOne({ userName: currentUserName })
		let userObj2 = await Users.findOne({ userName: oldUserName })

		if (!userObj1 || !userObj2) {
			return res
				.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
				.send({ msg: "Username(s) do not exist" })
		}

		transporter.sendMail({
			from: config.nodemailer.EMAIL_ID,
			to: config.adminEmail,
			subject: "Request to claim old username",
			// text: "Hello world?", 
			html: `<p><b>Email address: </b>${req.body.email}</p><p><b>Current username: </b>${currentUserName}</p><p><b>Old username: </b>${oldUserName}</p><p><b>New username: </b>${newUserName}</p>`
		});

		transporter.sendMail({
			from: config.nodemailer.EMAIL_ID,
			to: req.body.email,
			subject: "Request to claim old username has been received",
			// text: "Hello world?", 
			html: `<p><b>Current username: </b>${currentUserName}</p><p><b>Old username: </b>${oldUserName}</p><p><b>Stats from both accounts will be merged with new username: </b>${newUserName}</p>`
		});

		let messageObj = {
			userUID: req.body.userUID,
			email: req.body.email,
			subject: `Claim username`,
			body: `Current username: ${currentUserName} || Old username: ${oldUserName} || New username: ${newUserName}`
		}
		let newMessage = new Messages(messageObj)
		await newMessage.save()

		return res
			.status(constants.STATUS_CODE.SUCCESS_STATUS)
			.send({ msg: "Request sent" })

	} catch (error) {
		console.log(`Error while getting getAllUsers ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send({ msg: error.message })
	}
}