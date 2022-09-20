import Users from '../models/mongoDB/users'
import Game from '../models/mongoDB/game'
import GameMember from '../models/mongoDB/gameMember'
import PlayCard from '../../utils/playCard'
import DeclareRound from '../../utils/declareRound'
import { emitToUserUID, emitToUserId } from './emitter'
import { sysidConnected, userid_useruid, useruid_sysid, useruid_userid } from '../../utils/trackConnections'
import { emitLobbyDataToAllInGame, emitDataToAllInGame } from './sendUpdates'

var PlayerListeners = (socket) => {

	socket.on('drop-cards', async (authToken, body) => {

		const userUID = socket.handshake.userUID
		const email = socket.handshake.email
		let reqUserId = useruid_userid[userUID]

		try {
			if (!body.selected) {
				return socket.emit('common-game-data', "ERROR", "Selected cards required to drop cards")
			} else if (!body.gameId) {
				return socket.emit('common-game-data', "ERROR", "Game Id required to drop cards")
			} else if (!body.type) {
				return socket.emit('common-game-data', "ERROR", "Type required to drop cards")
			}

			let gameMember = await GameMember.findOne({
				gameId: body.gameId,
				userId: reqUserId
			})

			let game = await Game.findOne({
				gameId: body.gameId
			})

			if (!game || !gameMember) {
				return socket.emit('common-game-data', "ERROR", "Cannot drop cards with invalid game id")
			}

			var newCardsInHand = []
			var timestamp = Date.now()

			var activePlayers = await GameMember.find({
				gameId: body.gameId,
				isEliminated: false
			})
			var activePlayersIds = []
			for (var player of activePlayers) {
				activePlayersIds.push(player.userId.toString())
			}
			var nextPlayerIndex = (activePlayersIds.indexOf(reqUserId.toString()) + 1) % activePlayersIds.length
			var nextPlayer = activePlayersIds[nextPlayerIndex]

			// Validate if selected is part of what they have in hand
			var selected = []
			var cardValue = -1
			for (var temp of body.selected) {
				if (gameMember.currentCards.includes(parseInt(temp))) {
					if (cardValue == -1) {
						cardValue = parseInt(temp) % 13
					} else if (parseInt(temp) % 13 != cardValue) {
						return socket.emit('common-game-data', "ERROR", "User cannot drop cards of different values")
					}
					selected.push(parseInt(temp))
				} else {
					return socket.emit('common-game-data', "ERROR", "User cannot drop cards that they do not have")
				}
			}

			if (body.type === "Deck") {
				newCardsInHand = await PlayCard.fromDeck(game, gameMember, selected, timestamp, nextPlayer)
			} else if (body.type === "Table") {
				newCardsInHand = await PlayCard.fromTop(game, gameMember, selected, timestamp, nextPlayer)
			} else if (body.type === "Start") {
				newCardsInHand = await PlayCard.firstTurn(game, gameMember, selected, timestamp, nextPlayer)
			} else {
				return socket.emit('common-game-data', "ERROR", "Invalid type while dropping cards")
			}

			return await emitDataToAllInGame(body.gameId)

		} catch (err) {
			if (err.message) {
				return socket.emit('common-game-data', "ERROR", err.message)
			}
			return socket.emit('common-game-data', "ERROR", err)
		}

	})

	socket.on('declare', async (authToken, body) => {

		const userUID = socket.handshake.userUID
		const email = socket.handshake.email
		let reqUserId = useruid_userid[userUID]

		try {
			await DeclareRound(body.gameId, reqUserId, false)
			return await emitDataToAllInGame(body.gameId)

		} catch (err) {
			return socket.emit('common-game-data', "ERROR", err)
		}
	})

	socket.on('leave-game', async (authToken, body) => {

		const userUID = socket.handshake.userUID
		const email = socket.handshake.email
		let reqUserId = useruid_userid[userUID].toString()

		try {

			let game
			game = await Game.findOne({
				gameId: body.gameId
			})
			if (!game) {
				return socket.emit('common-game-data', "ERROR", "Invalid game id")
			}

			if (reqUserId === game.createdUser.toString() && game.players.length === 1) {
				await Game.deleteOne({
					gameId: body.gameId
				})
			} else if (reqUserId === game.createdUser.toString()) {
				let newCreatedUser
				for (var player of game.players) {
					if (player.toString() != game.createdUser.toString()) {
						newCreatedUser = player
						break
					}
				}
				await Game.updateOne(
					{
						gameId: body.gameId
					},
					{
						$pull: {
							players: reqUserId
						},
						createdUser: newCreatedUser
					}
				)
			} else {
				await Game.updateOne(
					{
						gameId: body.gameId
					},
					{
						$pull: {
							players: reqUserId,
							waiting: reqUserId
						}
					}
				)
			}

			socket.emit('common-game-data', "LEAVE_GAME")
			return await emitDataToAllInGame(body.gameId)
		} catch (err) {
			if (err.message) {
				return socket.emit('common-game-data', "ERROR", err.message)
			}
			return socket.emit('common-game-data', "ERROR", err)
		}
	})

	socket.on('remove-player', async (authToken, body) => {

		const userUID = socket.handshake.userUID
		const email = socket.handshake.email
		let reqUserId = useruid_userid[userUID].toString()

		try {

			let game
			game = await Game.findOne({
				gameId: body.gameId
			})
			if (!game) {
				return socket.emit('common-game-data', "ERROR", "Invalid game id")
			}

			if (reqUserId !== game.createdUser.toString()) {
				return socket.emit('common-game-data', "ERROR", "Only game admin can remove players")
			} else if (body.userId.toString() === game.createdUser.toString()) {
				return socket.emit('common-game-data', "ERROR", "Cannot remove yourself from game. Please leave game")
			} else {
				await Game.updateOne(
					{
						gameId: body.gameId
					},
					{
						$pull: {
							players: body.userId
						}
					}
				)
			}

			let removePlayerUID, removePlayerSysId, removePlayerSocket
			if (body.userId in userid_useruid) {
				removePlayerUID = userid_useruid[body.userId]
			}
			if (removePlayerUID in useruid_sysid) {
				removePlayerSysId = useruid_sysid[removePlayerUID]
				removePlayerSocket = sysidConnected[removePlayerSysId]["socket"]
				removePlayerSocket.emit('common-game-data', "LEAVE_GAME")
			}
			
			return await emitDataToAllInGame(body.gameId)
		} catch (err) {
			if (err.message) {
				return socket.emit('common-game-data', "ERROR", err.message)
			}
			return socket.emit('common-game-data', "ERROR", err)
		}
	})

	socket.on('reactions', async (authToken, body) => {
		const userUID = socket.handshake.userUID
		const email = socket.handshake.email
		let reqUserId = useruid_userid[userUID].toString()

		try {
			var game = await Game.findOne({ gameId: body.gameId })
            if (!game) {
                return socket.emit('reactions', "ERROR", "Reacting to invalid game id")
            } else if (game.isStarted) {
                let playersInGame = game.players
				playersInGame = playersInGame.concat(game.waiting)
				playersInGame = playersInGame.concat(game.spectators)
                let playerObj
                let allPlayers = {}
                let playerUID = []
                let isAdmin = false
                for (var id of playersInGame) {
					return emitToUserId(id, 'reactions', body.data)
                }
            } else {
				return socket.emit('reactions', "ERROR", "Game has not yet started")
            }
		} catch (err) {
			if (err.message) {
				return socket.emit('reactions', "ERROR", err.message)
			}
			return socket.emit('reactions', "ERROR", err)
		}
	})

}

export default PlayerListeners