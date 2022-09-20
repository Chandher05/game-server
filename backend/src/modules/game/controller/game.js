import Users from '../../../models/mongoDB/users';
import Game from '../../../models/mongoDB/game';
import GameMember from '../../../models/mongoDB/gameMember';
import constants from '../../../utils/constants';
import GenerateId from '../../../utils/generateId';

let allUserUIDs = {}

/**
 * Create game and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.createGame = async (req, res) => {
	try {

		if (req.body.userUID in allUserUIDs) {
			req.body.userId = allUserUIDs[req.body.userUID]
		} else {
			let reqUserObj = await Users.findOne({
				userUID: req.body.userUID
			})
			req.body.userId = reqUserObj._id
			allUserUIDs[req.body.userUID] = reqUserObj._id
		}

		let game
		game = await Game.find({
			players: req.body.userId,
			isStarted: true,
			isEnded: false
		})
		if (game.length > 0) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("User is already part of a game. Please refresh page")
		}

		game = await Game.find({
			isStarted: true,
			isEnded: false
		})

		if (game.length > 5) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("Game rooms are full! Please wait for a few minutes")
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

		let maxScore = req.body.maxScore ? req.body.maxScore : 100 
		let scoreWhenEndWithPair = req.body.scoreWhenEndWithPair ? req.body.scoreWhenEndWithPair : -25 
		let scoreWhenWrongCall = req.body.scoreWhenWrongCall ? req.body.scoreWhenWrongCall : 50
		let canDeclareFirstRound = req.body.canDeclareFirstRound ? req.body.canDeclareFirstRound : true 
		let autoplayTimer = req.body.autoplayTimer ? req.body.autoplayTimer : 60 
		let isPublicGame = req.body.isPublicGame ? req.body.isPublicGame : false 

		let gameId = await GenerateId(6)
		const gameData = new Game({
			players: [req.body.userId],
			gameId: gameId,
			createdUser: req.body.userId,
			currentPlayer: req.body.userId,
			cardsInDeck: [],
			openedCards: [],
			previousDroppedCards: [],
			previousDroppedPlayer: " ",
			lastPlayedTime: " ",
			lastPlayedAction: " ",
			maxScore: maxScore,
			endWithPair: scoreWhenEndWithPair,
			wrongCall: scoreWhenWrongCall,
			canDeclareFirstRound: canDeclareFirstRound,
			autoplayTimer: autoplayTimer,
			isPublicGame: isPublicGame
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

		if (req.body.userUID in allUserUIDs) {
			req.body.userId = allUserUIDs[req.body.userUID]
		} else {
			let reqUserObj = await Users.findOne({
				userUID: req.body.userUID
			})
			req.body.userId = reqUserObj._id
			allUserUIDs[req.body.userUID] = reqUserObj._id
		}

		let game
		game = await Game.findOne({
			$or: [{ players: req.body.userId }, { waiting: req.body.userId }],
			isEnded: false
		})
		if (game) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send(`User is already part of a game ${game.gameId}.`)
		}


		game = await Game.findOne({
			gameId: req.body.gameId
		})
		if (!game) {
			return res.status(constants.STATUS_CODE.NO_CONTENT_STATUS)
				.send("Game does not exist")
		} else if (game.players.includes(req.body.userId)) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("User has already joined game. Please refresh.")
		} else if (game.players.length + game.waiting.length === 5) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("Game is full")
		} else if (game.isStarted == true) {

			let hasPlayerLeft = await GameMember.findOne({
				gameId: req.body.gameId,
				userId: req.body.userId
			})

			if (hasPlayerLeft) {
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

				await GameMember.findOneAndUpdate(
					{
						gameId: req.body.gameId,
						userId: req.body.userId
					},
					{
						didPlayerLeave: false
					}
				)

				return res
					.status(constants.STATUS_CODE.SUCCESS_STATUS)
					.send({
						gameId: req.body.gameId,
						createdUser: game.createdUser,
						isStarted: game.isStarted
					})
			}

			game = await Game.findOneAndUpdate(
				{
					gameId: req.body.gameId
				},
				{
					$pull: {
						waiting: req.body.userId
					}
				}
			)

			game = await Game.findOneAndUpdate(
				{
					gameId: req.body.gameId
				},
				{
					$push: {
						waiting: req.body.userId
					}
				}
			)
			return res
				.status(constants.STATUS_CODE.SUCCESS_STATUS)
				.send({
					gameId: req.body.gameId,
					createdUser: game.createdUser,
					isStarted: game.isStarted
				})
		}


		game = await Game.findOneAndUpdate(
			{
				gameId: req.body.gameId
			},
			{
				$pull: {
					players: req.body.userId
				}
			}
		)

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
		console.log(`Error while joining game ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}


/**
 * Quit a game from the lobby.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.quitFromLobby = async (req, res) => {
	try {

		if (req.body.userUID in allUserUIDs) {
			req.body.userId = allUserUIDs[req.body.userUID]
		} else {
			let reqUserObj = await Users.findOne({
				userUID: req.body.userUID
			})
			req.body.userId = reqUserObj._id
			allUserUIDs[req.body.userUID] = reqUserObj._id
		}

		let game
		game = await Game.findOne({
			players: req.body.userId,
			gameId: req.body.gameId
		})
		if (!game) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("Game does not exist")
		} else if (game.isStarted) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("Game has already started")
		} else if (game.isEnded) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("Game has already ended")
		} else if (req.body.userId.toString() === game.createdUser.toString()) {
			let newCreatedUser
			if (game.players.length > 1) {
				for (let playerUserId of game.players) {
					if (playerUserId != game.createdUser) {
						newCreatedUser = playerUserId
						break
					}
				}
			}
			if (newCreatedUser) {
				await Game.updateOne(
					{
						gameId: req.body.gameId
					},
					{
						$pull: {
							players: req.body.userId
						},
						createdUser: newCreatedUser,
						currentPlayer: newCreatedUser
					}
				)
			} else {
				await Game.deleteOne({
					gameId: req.body.gameId
				})
			}

		} else {
			await Game.updateOne(
				{
					gameId: req.body.gameId
				},
				{
					$pull: {
						players: req.body.userId
					}
				}
			)
		}

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(req.body.gameId)
	} catch (error) {
		console.log(`Error in game/quitFromLobby ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Spectate a game.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.spectateGame = async (req, res) => {
	try {
		if (req.body.userUID in allUserUIDs) {
			req.body.userId = allUserUIDs[req.body.userUID]
		} else {
			let reqUserObj = await Users.findOne({
				userUID: req.body.userUID
			})
			req.body.userId = reqUserObj._id
			allUserUIDs[req.body.userUID] = reqUserObj._id
		}

		let game
		game = await Game.findOne({
			$or: [{ players: req.body.userId }, { spectators: req.body.userId }, { waiting: req.body.userId }],
			isEnded: false
		})
		if (game) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send(`User is already part of a game ${game.gameId}.`)
		}

		game = await Game.findOne({
			gameId: req.body.gameId
		})

		if (!game) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send(`Invalid game id`)
		} else if (game.isEnded) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send(`Game has ended`)
		} else if (!game.isStarted) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send(`Wait for game to start`)
		}


		await Game.updateOne(
			{
				gameId: req.body.gameId
			},
			{
				$push: {
					spectators: req.body.userId
				}
			}
		)

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send("Spectating game")
	} catch (error) {
		console.log(`Error in game/spectateGame ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Spectate a game.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getPublicGames = async (req, res) => {
	try {
		let games = await Game.find({
			isPublicGame: true
		})

		let returnObj = []
		for (var gameObj of games) {
			returnObj.push({
				gameId: gameObj.gameId,
				numOfPlayersInGame: gameObj.players.length,
				numOfPlayersWaiting: gameObj.waiting.length,
				numOfPlayersSpectating: gameObj.spectators.length,
				isStarted: gameObj.isStarted,
				maxScore: gameObj.maxScore,
				endWithPair: gameObj.endWithPair,
				wrongCall: gameObj.wrongCall,
				canDeclareFirstRound: gameObj.canDeclareFirstRound,
			})
		}

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(returnObj)
	} catch (error) {
		console.log(`Error in game/spectateGame ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}