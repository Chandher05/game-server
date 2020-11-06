import Users from '../../../models/mongoDB/users';
import Game from '../../../models/mongoDB/game';
import GameMember from '../../../models/mongoDB/gameMember';
import constants from '../../../utils/constants';
import GenerateId from '../../../utils/generateId';
import GetCards from '../../../utils/getCards';
import PlayCard from '../../../utils/playCard';
import Shuffle from '../../../utils/shufflePlayer';
import { Mongoose } from 'mongoose';

/**
 * Create game and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.createGame = async (req, res) => {
	try {

		// If user is part of a game that has not ended
		let game
		game = await Game.findOne({
			players: req.body.userId,
			isEnded: false
		})
		if (game) {
			return res.status(constants.STATUS_CODE.UNAUTHORIZED_ERROR_STATUS)
				.send({
					gameId: gameId,
					createdUser: game.createdUser
				})
		}
		
		// If there are more than 5 active games
		game = await Game.find({
			isStarted: true,
			isEnded: false
		})

		if (game.length > 5) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
			.send("Game rooms are full! Please wait for a few minutes")
		}

		let gameId = await GenerateId(6)
		const gameData = new Game({
			players: [],
			spectators: [req.body.userId],
			gameId: gameId,
			createdUser: req.body.userId,
			currentPlayer: req.body.userId,
			cardsInDeck: [],
			openedCards: [],
			previousDroppedCards: [],
			previousDroppedPlayer: " ",
			lastPlayedTime: " ",
			lastPlayedAction: " "
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
			return res.status(constants.STATUS_CODE.UNAUTHORIZED_ERROR_STATUS)
				.send("User has already joined game. Please refresh.")
		} else if (game.players.length + game.waiting.length === 5) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
			.send("Game is full")
		} else if (game.isStarted == true) {
			// game = await Game.findOne({
			// 	gameId: req.body.gameId,
			// 	$or: [{players: req.body.userId}, {waiting: req.body.userId}],
			// 	isEnded: false
			// })
			// if (game) {
			// 	return res.status(constants.STATUS_CODE.UNAUTHORIZED_ERROR_STATUS)
			// 	.send("User has already joined game")
			// }

			// game = await Game.findOneAndUpdate(
			// 	{
			// 		gameId: req.body.gameId
			// 	},
			// 	{
			// 		$pull: {
			// 			waiting: req.body.userId
			// 		}
			// 	}
			// )
	
			// game = await Game.findOneAndUpdate(
			// 	{
			// 		gameId: req.body.gameId
			// 	},
			// 	{
			// 		$push: {
			// 			waiting: req.body.userId
			// 		}
			// 	}
			// )
			return res
			.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
			.send("Oops! You are too late. Sorry")
		}
			
		game = await Game.findOne({
			gameId: req.body.gameId,
			$or: [{players: req.body.userId}, {waiting: req.body.userId}],
			isEnded: false
		})
		if (game) {
			return res.status(constants.STATUS_CODE.UNAUTHORIZED_ERROR_STATUS)
			.send("User has already joined game")
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
 * Check if user is already part of a game.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.isUserPartOfGame = async (req, res) => {
	try {

		if (req.params.userId == "null") {
			return res
			.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
			.send(null)
		}

		let game
		game = await Game.findOne({
			$or: [{players: req.params.userId}, {waiting: req.params.userId}],
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
		console.log(`Error in game/isUserPartOfGame ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Reset a game.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.resetGame = async (req, res) => {
	try {

		let game
		game = await Game.findOne({
			gameId: req.params.gameId
		})
		if (!game) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send({
					gameId: game.gameId,
					createdUser: req.params.userId
				})
		}

		await GameMember.deleteMany({
			gameId: req.params.gameId
		})
		game = await Game.findOneAndUpdate(
			{
				gameId: req.params.gameId
			},
			{
				isStarted: false,
				isRoundComplete: false,
				isEnded: false,
				cardsInDeck: [],
				openedCards: []
			}
		)

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
		console.log(`Error game/resetGame ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}


/**
 * Start a game.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.startGame = async (req, res) => {
	try {

		let game
		game = await Game.findOne({
			gameId: req.body.gameId
		})
		if (!game) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("Game does not exist")
		} else if (game.players.length < 2) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("Not enough players to start the game")
		} else if (game.isStarted === true) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
			.send("Game has already started")
		}

		var availableCards = []
		for (var index = 1; index < 53; index++) {
			availableCards.push(index)
		}

		var startedUser = null
		for (var userId of game.players) {
			let result, cardsForPlayer
			let userObj = await Users.findById(userId)
			if (game.players[0].toString() == userId.toString()) {
				startedUser = userObj.userName
				result = GetCards.getCards(availableCards, 6)
			} else {
				result = GetCards.getCards(availableCards, 5)
			}
			cardsForPlayer = result.cardsForPlayer;
			availableCards = result.availableCards;
			let gameMemberObj = new GameMember({
				gameId: req.body.gameId,
				userId: userId,
				userName: userObj.userName,
				currentCards: cardsForPlayer
			})
			await gameMemberObj.save()
		}
		let timestamp = Date.now()
		game = await Game.findOneAndUpdate(
			{
				gameId: req.body.gameId
			},
			{
				currentPlayer: game.players[0],
				isStarted: true,
				cardsInDeck: availableCards,
				lastPlayedTime: timestamp,
				previousDroppedPlayer: startedUser,
				lastPlayedAction: "will start the game"
			}
		)

		if (game) {
			PlayCard.playRandom(timestamp, req.body.gameId, game.createdUser)
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
		console.log(`Error game/startGame ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}


/**
 * Check if the game ID is of a valid game.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.validGame = async (req, res) => {
	try {

		let game
		game = await Game.findOne({
			gameId: req.params.gameId,
			isStarted: false,
			isEnded: false
		})
		if (!game) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send(null)
		}

		return res
			.status(constants.STATUS_CODE.NO_CONTENT_STATUS)
			.send(null)

	} catch (error) {
		console.log(`Error game/validGame ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}


/**
 * Start next round of game.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.nextRound = async (req, res) => {
	try {

		let game
		game = await Game.findOne({
			gameId: req.body.gameId
		})
		if (!game) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send({
					gameId: req.body.gameId,
					createdUser: req.body.userId
				})
		}
		var availableCards = []
		for (var index = 1; index < 53; index++) {
			availableCards.push(index)
		}

		var allPlayers = await GameMember.find({
			gameId: req.body.gameId
		})
		var activePlayers = []
		for (var player of allPlayers) {
			if (player.isAlive == true) {
				activePlayers.push(player)
			} else {
				await GameMember.findByIdAndUpdate(
					player._id,
					{
						currentCards: []
					}
				)
			}
		}
		var nextPlayerToStart = activePlayers[game.roundsComplete % activePlayers.length]
		var nextUserNameToStart = nextPlayerToStart.userName
		var nextUserIdToStart = nextPlayerToStart.userId
		
		var result,
			cardsForPlayer,
			createdUserCards
		for (var player of activePlayers) {
			
			if (nextUserIdToStart == player.userId) {
				result = GetCards.getCards(availableCards, 6)
			} else {
				result = GetCards.getCards(availableCards, 5)
			}
			cardsForPlayer = result.cardsForPlayer;
			availableCards = result.availableCards;
			
			if (game.createdUser.toString() == player.userId.toString()) {
				createdUserCards = cardsForPlayer
			}
			await GameMember.findByIdAndUpdate(
				player._id,
				{
					currentCards: cardsForPlayer
				}
			)
		}

		let timestamp = Date.now()
		game = await Game.findOneAndUpdate(
			{
				gameId: req.body.gameId
			},
			{
				currentPlayer: nextUserIdToStart,
				isRoundComplete: false,
				cardsInDeck: availableCards,
				lastPlayedTime: timestamp,
				previousDroppedPlayer: nextUserNameToStart,
				lastPlayedAction: "will start the next round"
			}
		)

		if (game) {
			PlayCard.playRandom(timestamp, req.body.gameId, nextUserIdToStart)
			return res
				.status(constants.STATUS_CODE.SUCCESS_STATUS)
				.send({
					createdUserCards: createdUserCards
				})
		}

		return res
			.status(constants.STATUS_CODE.NO_CONTENT_STATUS)
			.send({
				createdUserCards: []
			})

	} catch (error) {
		console.log(`Error game/nextRound ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Show all cards in a game.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.allCards = async (req, res) => {
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

		let gameMembers = await Game.find({
			gameId: req.body.gameId
		})

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send({
				game: game,
				gameMembers: gameMembers
			})
	} catch (error) {
		console.log(`Error in game/allCards ${error}`)
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

		let game
		game = await Game.findOne({
			gameId: req.body.gameId
		})
		if (!game) {
			return res.status(constants.STATUS_CODE.NO_CONTENT_STATUS)
				.send("Game does not exist")
		}
		
		if (req.body.userId === game.createdUser.toString()) {
			await Game.deleteOne({
				gameId: req.body.gameId
			})
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
 * Quit a game from the game.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.quitFromGame = async (req, res) => {
	try {

		let game
		game = await Game.findOne({
			gameId: req.body.gameId
		})
		if (!game) {
			return res.status(constants.STATUS_CODE.NO_CONTENT_STATUS)
				.send("Game does not exist")
		}
		
		if (req.body.userId === game.createdUser.toString() && game.players.length === 1) {
			await Game.deleteOne({
				gameId: req.body.gameId
			})
		} else if (req.body.userId === game.createdUser.toString()) {
			let newCreatedUser
			for (var player of game.players) {
				if (player.toString() != game.createdUser.toString()) {
					newCreatedUser = player
					break
				}
			}
			await Game.updateOne(
				{
					gameId: req.body.gameId
				},
				{
					$pull: {
						players: req.body.userId
					},
					createdUser: newCreatedUser
				}
			)
		} else {
			await Game.updateOne(
				{
					gameId: req.body.gameId
				},
				{
					$pull: {
						players: req.body.userId,
						waiting: req.body.userId
					}
				}
			)
		}

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(req.body.gameId)
	} catch (error) {
		console.log(`Error in game/quitFromGame ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Reset all games.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.resetAllGames = async (req, res) => {
	try {
		await Game.deleteMany()
		await GameMember.deleteMany()

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(null)
	} catch (error) {
		console.log(`Error in game/resetAllGames ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}


/**
 * Restart a game.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.restartGame = async (req, res) => {
	try {

		let oldGame = await Game.findOne({
			gameId: req.body.gameId
		})
		if (!oldGame) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("Game does not exist")
		} else if (oldGame.isEnded != true) {
			return res.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
				.send("Game cannot be restarted until it has ended")
		} else if (oldGame.players.length + oldGame.waiting.length < 2) {
			return res.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
				.send("Not enough players to restart the game")
		}
		
		let tempGameId = await GenerateId(6)
		await Game.updateOne(
			{
				gameId: req.body.gameId
			},
			{
				gameId: tempGameId
			}
		)

		await GameMember.updateMany(
			{
				gameId: req.body.gameId
			},
			{
				gameId: tempGameId
			}
		)

		var availableCards = []
		for (var index = 1; index < 53; index++) {
			availableCards.push(index)
		}

		let playersInNextGame = oldGame.players.concat(oldGame.waiting)
		let randomPlayerOrder = Shuffle(playersInNextGame)
		const newGameData = new Game({
			players: randomPlayerOrder,
			gameId: req.body.gameId,
			createdUser: oldGame.createdUser,
			currentPlayer: randomPlayerOrder[0],
			cardsInDeck: [],
			openedCards: [],
			previousDroppedCards: [],
			previousDroppedPlayer: " ",
			lastPlayedTime: " ",
			lastPlayedAction: " "
		})
		let newGame = await newGameData.save()

		var startedUser = null
		var createdUserCards = []
		for (var userId of newGame.players) {
			let result, cardsForPlayer
			let userObj = await Users.findById(userId)
			if (newGame.currentPlayer.toString() == userId.toString()) {
				startedUser = userObj.userName
				result = GetCards.getCards(availableCards, 6)
			} else {
				result = GetCards.getCards(availableCards, 5)
			}
			cardsForPlayer = result.cardsForPlayer;
			availableCards = result.availableCards;

			if (newGame.createdUser.toString() == userId.toString()) {
				createdUserCards = cardsForPlayer
			}
			
			let gameMemberObj = new GameMember({
				gameId: req.body.gameId,
				userId: userId,
				userName: userObj.userName,
				currentCards: cardsForPlayer
			})
			await gameMemberObj.save()
		}
		let timestamp = Date.now()
		let game = await Game.findOneAndUpdate(
			{
				gameId: req.body.gameId
			},
			{
				isStarted: true,
				cardsInDeck: availableCards,
				lastPlayedTime: timestamp,
				previousDroppedPlayer: startedUser,
				lastPlayedAction: "will start the game"
			}
		)

		if (game) {
			PlayCard.playRandom(timestamp, req.body.gameId, game.createdUser)
			return res
				.status(constants.STATUS_CODE.SUCCESS_STATUS)
				.send({
					gameId: game.gameId,
					createdUser: game.createdUser,
					createdUserCards: createdUserCards
				})
		}

		return res
			.status(constants.STATUS_CODE.NO_CONTENT_STATUS)
			.send(null)

	} catch (error) {
		console.log(`Error game/restartGame ${error}`)
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
			.send(null)
	} catch (error) {
		console.log(`Error in game/spectateGame ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Stop spectating a game.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.stopSpectateGame = async (req, res) => {
	try {
		console.log("REMOVING STUFF")
		await Game.updateOne(
			{
				gameId: req.body.gameId
			},
			{
				$pull: {
					spectators: req.body.userId
				}
			}
		)

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(null)
	} catch (error) {
		console.log(`Error in game/resetAllGames ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}