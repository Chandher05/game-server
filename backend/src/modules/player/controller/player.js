import Users from '../../../models/mongoDB/users';
import Game from '../../../models/mongoDB/game';
import GameMember from '../../../models/mongoDB/gameMember';
import constants from '../../../utils/constants';
import GetCards from '../../../utils/getCards';
import PlayCard from '../../../utils/playCard';
import DeclareRound from '../../../utils/declareRound';
import CardValues from '../../../utils/cardValues';

/**
 * Create current cards of the player.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.currentCards = async (req, res) => {
	try {

        let game = await GameMember.findOne({
            gameId: req.params.gameId,
            userId: req.params.userId
        })

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send({
				currentCards: game.currentCards
			})
	} catch (error) {
		console.log(`Error in player/currentCards ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Player drops cards and picks up from top or from the deck.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.dropCards = async (req, res) => {
	try {

		let gameMember = await GameMember.findOne({
			gameId: req.body.gameId,
			userId: req.body.userId
		})

        let game = await Game.findOne({
			gameId: req.body.gameId
		})

		var difference = []
		var timestamp = Date.now()
        var nextPlayerIndex = (game.players.indexOf(gameMember.userId) + 1 ) % game.players.length
		var nextPlayer = game.players[nextPlayerIndex]
		var selected = []
		for (var temp of req.body.selected) {
			selected.push(parseInt(temp))
		}

		if (req.body.type === "Deck") {
			difference = await PlayCard.fromDeck(game, gameMember, selected, timestamp, nextPlayer)
		} else if (req.body.type === "Top") {
			difference = await PlayCard.fromTop(game, gameMember, selected, timestamp, nextPlayer)
		} else {
			difference = await PlayCard.firstTurn(game, gameMember, selected, timestamp, nextPlayer)
		}

		PlayCard.playRandom(timestamp, req.body.gameId, nextPlayer)

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send({
				currentCards: difference
			})
	} catch (error) {
		console.log(`Error in player/dropCards ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Player shows their card and declares.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.declare = async (req, res) => {
	try {

		await DeclareRound(req.body.gameId, req.body.userId)
		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(null)
	} catch (error) {
		console.log(`Error in player/declare ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}