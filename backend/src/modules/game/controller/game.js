import mongoose from 'mongoose';
import Users from '../../../models/mongoDB/users';
import Game from '../../../models/mongoDB/game';
import constants from '../../../utils/constants';
import GenerateId from '../../../utils/generateId';

/**
 * Create game and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.createGame = async (req, res) => {
	try {

		let game
		game = await Game.find({
			players: req.body.userId,
			isStarted: true,
			isEnded: false
		})
		if (game.length > 0) {
			console.log(game)
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("User is already part of a game")
		}

		game = await Game.findOne({
			players: req.body.userId,
			isStarted: false,
			isEnded: false
		})
		if (game) {
			return res.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
				.send({
					gameId: game.gameId,
					createdUser: req.body.userId
				})
		}

		let gameId = await GenerateId(6)
		const gameData = new Game({
			players: [req.body.userId],
			gameId: gameId
		})

		await gameData.save()


		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send({
				gameId: gameId,
				createdUser: req.body.userId
			})
	} catch (error) {
		console.log(`Error while creating game ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Join a game.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.joinGame = async (req, res) => {
	try {

		let game
		game = await Game.findOne({
			gameId: req.body.gameId
		})
		if (!game) {
			return res.status(constants.STATUS_CODE.NO_CONTENT_STATUS)
				.send("Game does not exist")
		} else if (game.players.includes(req.body.userId)) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("User is already part of a game")
		}
		game = await Game.findOneAndUpdate(
			{
				gameId: req.body.gameId
			},
			{
				$push: {
					players: req.body.userId
				}
			}
		)


		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send({
				gameId: req.body.gameId,
				createdUser: game.createdUser
			})
	} catch (error) {
		console.log(`Error while creating game ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Check if user is already part of a game.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.isUserPartOfGame = async (req, res) => {
	try {

		let game
		game = await Game.findOne({
			players: req.params.userId,
			isStarted: true,
			isEnded: false
		})
		if (game) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send({
					gameId: game.gameId,
					createdUser: req.body.userId
				})
		}
		
		game = await Game.findOne({
			players: req.params.userId,
			isStarted: false,
			isEnded: false
		})

		if (game) {
			return res
			.status(constants.STATUS_CODE.SUCCESS_STATUS)
			.send({
				gameId: game.gameId,
				createdUser: game.createdUser
			})
		}
		return res
		.status(constants.STATUS_CODE.NO_CONTENT_STATUS)
		.send(null)

	} catch (error) {
		console.log(`Error while creating game ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}