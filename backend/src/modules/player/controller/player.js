import Users from '../../../models/mongoDB/users';
import Game from '../../../models/mongoDB/game';
import GameMember from '../../../models/mongoDB/gameMember';
import constants from '../../../utils/constants';
import GetCards from '../../../utils/getCards';

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
		console.log(`Error while creating game ${error}`)
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
		console.log(req.body.selected)
		for (var card of gameMember.currentCards) {
			if (req.body.selected.includes(card.toString()) === false) {
				console.log(card)
				difference.push(card)
			}
		}

		var result
		if (req.body.type === "Deck") {
			result = GetCards.getCards(game.cardsInDeck, 1);
			difference = difference.concat(result.cardsForPlayer)
			await Game.findOneAndUpdate(
				{
					gameId: req.body.gameId
				},
				{
					cardsInDeck: result.availableCards,
					$push: {
						openedCards: req.body.selected,
					},
					previousDroppedCards: req.body.selected,
					previousDroppedPlayer: gameMember.userName
				}
			)
		} else if (req.body.type === "Top") {
			var openedCards = game.openedCards
			difference.push(openedCards.pop())
			openedCards = openedCards.concat(req.body.selected)
			await Game.findOneAndUpdate(
				{
					gameId: req.body.gameId
				},
				{
					openedCards: openedCards,
					previousDroppedCards: req.body.selected,
					previousDroppedPlayer: gameMember.userName
				}
			)
		} else {
			await Game.findOneAndUpdate(
				{
					gameId: req.body.gameId
				},
				{
					openedCards: req.body.selected,
					previousDroppedCards: req.body.selected,
					previousDroppedPlayer: gameMember.userName
				}
			)			
		}
		
		await GameMember.findOneAndUpdate(
			{
				gameId: req.body.gameId,
				userId: req.body.userId
			},
			{
				currentCards: difference	
			}
		)

		console.log(difference)
		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send({
				currentCards: difference
			})
	} catch (error) {
		console.log(`Error while creating game ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}