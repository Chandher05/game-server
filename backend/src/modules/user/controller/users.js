import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import Users from '../../../models/mongoDB/users';
import GameMember from '../../../models/mongoDB/gameMember';
import UpdatePassword from '../../../models/mongoDB/updatePassword';
import constants from '../../../utils/constants';
import S3 from '../../../utils/S3Operations';
import config from '../../../../config';
import UpdateHashPassword from '../../../utils/updateHashPassword';


/**
 * Create user and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.createUser = async (req, res) => {
	let createdUser

	let filter = {}
	try {
		filter.userName = req.body.userName
		const user = await Users.findOne(filter)
		if (user) {
			return res
				.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send(constants.MESSAGES.USER_ALREADY_EXISTS)
		}

		let userObj = req.body
		let newUser = new Users(userObj)
		createdUser = await newUser.save()
		createdUser = createdUser.toJSON()
		delete createdUser.password
		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(createdUser)
	} catch (error) {
		console.log(`Error while creating user ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

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
			userName: req.body.userName,
			isActive: true
		})

		if (user) {
			const validate = await user.validatePassword(req.body.password)
			if (validate) {
				user = user.toJSON()
				delete user.password
				isAuth = true
				return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(user)
			}
		}
		if (!isAuth) {
			return res
				.status(constants.STATUS_CODE.UNAUTHORIZED_ERROR_STATUS)
				.send(constants.MESSAGES.AUTHORIZATION_FAILED)
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
		if (req.body.userName == undefined) {
			return res
				.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
				.send(constants.MESSAGES.USER_VALUES_MISSING)
		}

		const user = await Users.findOne({
			_id: {
				$ne: mongoose.Types.ObjectId(req.body.userId)
			},
			userName: req.body.userName
		})
		if (user) {
			return res
				.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send(constants.MESSAGES.USER_ALREADY_EXISTS)
		}

		let userObj = req.body

		// updating password
		if (req.body.password) {
			userObj.password = updatePassword(req.body.password)
		} else {
			delete userObj.password
		}

		let details = await Users.findByIdAndUpdate(
			mongoose.Types.ObjectId(req.body.userId),
			{
				userName: req.body.userName
			}
		)
		let gameMembers = await GameMember.find({
			userId: req.body.userId
		})
		for (var game of gameMembers) {
			await GameMember.findByIdAndUpdate(
				game._id,
				{
					userName: req.body.userName
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
exports.reportBug = async (req, res) => {

	try {
		let user = await Users.findById(req.body.userId)
		if (!user) {
			return res
				.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
				.send("Not a valid user")
		}

		var attachments = []
		for (var file of req.files) {
			if (file.size > 20971520) {
				return res
				.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
				.send("Single file cannot be more than 20 MB")
			}
			// var url = await S3.fileupload(user.userName, file)
			attachments.push({
				filename: file.originalname,
				// path: url
				content: new Buffer(file.buffer)
			})
		}

		let transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			// service: 'gmail',
			auth: {
				user: config.nodemailer.EMAIL_ID,
				pass: config.nodemailer.PASSWORD,
			},
		});

		transporter.sendMail({
			from: config.nodemailer.EMAIL_ID,
			to: "jayasurya1796@gmail.com",
			subject: "A new bug report from declare game",
			// text: "Hello world?", 
			html: `<p><b>Email address: </b>${req.body.email}</p><p><b>Username: </b>${user.userName}</p><p>${req.body.description}</p>`,
			attachments: attachments
		});

		transporter.sendMail({
			from: config.nodemailer.EMAIL_ID,
			to: req.body.email,
			subject: "We have received your bug report",
			// text: "Hello world?", 
			html: `<p>Thank you for reporting. We will work on it as soon as possible. 
			The good thing about this game is that you can create as many accounts as you wish. 
			So if your game is not responding, we're sorry about it but please logout and create a new 
			account to play more games</p><p><b>Your description of the bug</b></p><p>${req.body.description}</p>`,
			attachments: attachments
		});

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

			let ratio = 0
            if (user.totalGames > 0) {
                ratio = user.totalDeclares / user.totalGames
			}
			ratio = ratio.toFixed(2)
			
			allUsersData.push({
				userId: userId,
				userName: user.userName,
				gamesCount: user.totalGames,
				totalWins: user.totalWins,
				totalDeclares: user.totalDeclares,
				ratio: ratio,
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
 * Enable update user password.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.enableUpdatePassword = async (req, res) => {
	try {

		let data = new UpdatePassword({ userId : req.body.userId })
		await data.save()

		return res
		.status(constants.STATUS_CODE.SUCCESS_STATUS)
		.send("Success")

	} catch (error) {
		console.log(`Error while getting getAllUsers ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Diable update user password.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.disableUpdatePassword = async (req, res) => {
	try {

		await UpdatePassword.updateMany(
			{
				userId: req.body.userId
			},
			{
				isActive: false
			}
		)

		return res
		.status(constants.STATUS_CODE.SUCCESS_STATUS)
		.send("Success")

	} catch (error) {
		console.log(`Error while getting getAllUsers ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Update user password.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.updatePassword = async (req, res) => {
	try {

		if (!req.body.password) {
			return res.status(constants.STATUS_CODE.UNAUTHORIZED_ERROR_STATUS)
			.send("Invalid details")
		}

		let cutoff = Date.now() - 2
		let data = await UpdatePassword.find({
			userId: req.body.userId,
			isActive: {
				$gt: {
					cutoff	
				}
			},
			isActive: true
		})


		if (data.length === 0 ) {
			return res.status(constants.STATUS_CODE.UNAUTHORIZED_ERROR_STATUS)
			.send("Invalid details")
		}

		await Users.findByIdAndUpdate(
			req.body.userId,
			{
				password: UpdateHashPassword(req.body.password)
			}
		)
		console.log(req.body.password)

		await UpdatePassword.updateMany(
			{
				userId: req.body.userId
			},
			{
				isActive: false
			}
		)

		return res
		.status(constants.STATUS_CODE.SUCCESS_STATUS)
		.send("Success")

	} catch (error) {
		console.log(`Error while getting getAllUsers ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Check if user is authorized to update password.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.isUpdatePasswordActive = async (req, res) => {
	try {

		let cutoff = Date.now() - 2
		let data = await UpdatePassword.find({
			userId: req.body.userId,
			isActive: {
				$gt: {
					cutoff	
				}
			},
			isActive: true
		})


		if (data.length === 0 ) {
			return res.status(constants.STATUS_CODE.UNAUTHORIZED_ERROR_STATUS)
			.send("Invalid details")
		}

		data = await Users.findById(req.body.userId)
		delete data.password

		return res
		.status(constants.STATUS_CODE.SUCCESS_STATUS)
		.send(data)

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