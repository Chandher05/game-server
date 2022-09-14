import Game from '../src/models/mongoDB/game';
import { shuffle } from './getCards';

var restockDeck = (gameId) => {
    return new Promise( async(resolve) => {
        let game = await Game.findOne({
            gameId: gameId
        })
        if (game.cardsInDeck.length > 2) {
            resolve()
            return
        }

        console.log(`Restocking deck for ${gameId}`)

        let openedCards = game.openedCards
        for (var card in game.previousDroppedCards) {
            openedCards.pop()
        }

        let cardsInDeck = openedCards.concat(game.cardsInDeck)
        shuffle(cardsInDeck)
        game = await Game.findByIdAndUpdate(
            game._id,
            {
                cardsInDeck: cardsInDeck,
                openedCards: game.previousDroppedCards
            }
        )

        resolve()
    })
}

export default restockDeck;