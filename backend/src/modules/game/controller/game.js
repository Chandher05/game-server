import Users from '../../../models/mongoDB/users';
import Game from '../../../models/mongoDB/game';
import GameMember from '../../../models/mongoDB/gameMember';
import constants from '../../../utils/constants';
import GenerateId from '../../../utils/generateId';
import GetCards from '../../../utils/getCards';
import PlayCard from '../../../utils/playCard';

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
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("User is already part of a game")
		} else if (game.players.length === 5) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send("Game is full")
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
				.send({
					gameId: req.body.gameId,
					createdUser: req.body.userId
				})
		}
		var availableCards = []
		for (var index = 1; index < 53; index++) {
			availableCards.push(index)
		}

		var startedUser = null
		for (var userId of game.players) {
			let result, cardsForPlayer
			let userObj = await Users.findById(userId)
			if (game.createdUser.toString() == userId.toString()) {
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
				currentPlayer: game.createdUser,
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
			isStarted: true,
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

		var activePlayers = await GameMember.find({
			gameId: req.body.gameId,
			isAlive: true
		})
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
			await Game.findOneAndDelete({
				gameId: req.body.gameId
			})
		} else {
			await Game.findOneAndUpdate(
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
		
		if (req.body.userId === game.createdUser.toString()) {
			await Game.findOneAndDelete({
				gameId: req.body.gameId
			})
		} else {
			await Game.findOneAndUpdate(
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
		console.log(`Error in game/quitFromGame ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}