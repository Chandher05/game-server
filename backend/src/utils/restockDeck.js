import Game from '../models/mongoDB/game';

var restockDeck = (gameId) => {
    return new Promise( async(resolve) => {
        let game = await Game.findOne({
            gameId: gameId
        })
        if (game.cardsInDeck.length > 5) {
            resolve()
        }

        console.log(`Restocking deck for ${gameId}`)
        
        
        

        let openedCards = game.openedCards
        for (var card in game.previousDroppedCards) {
            openedCards.pop()
        }

        let cardsInDeck = game.cardsInDeck.concat(openedCards)
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