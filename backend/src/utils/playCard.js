import Game from '../models/mongoDB/game';
import GameMember from '../models/mongoDB/gameMember';
import GetCards from './getCards';

function sleep(s) {
    var ms = s * 1000
    return new Promise(resolve => setTimeout(resolve, ms));
}

var selectCards = (userId, gameId) => {
    return new Promise(async (resolve) => {
        var gameMember = await GameMember.findOne({
            userId: userId,
            gameId: gameId
        })

        var allCards = []
        for (var index1 = 0; index1 < gameMember.currentCards.length; index1++) {
            var cardValue1 = gameMember.currentCards[index1]
            allCards.push([cardValue1])


            for (var index2 = index1 + 1; index2 < gameMember.currentCards.length; index2++) {
                var cardValue2 = gameMember.currentCards[index2]
        
                if ((cardValue1 - cardValue2) % 13 == 0) {
                    allCards.push([cardValue1, cardValue2])
                }
            }
        }

        var randomCards = allCards[Math.floor(Math.random() * allCards.length)]
        resolve(randomCards)
    })
}

var getDifference = (gameMember, selected) => {
    
    var difference = []
    for (var card of gameMember.currentCards) {
        if (selected.includes(card) == false) {
            difference.push(card)
        }
    }
    return difference
}

var updateDifferenceInPlayer = (gameId, userId, difference) => { 
    return new Promise( async (resolve) => {
        await GameMember.findOneAndUpdate(
            {
                gameId: gameId,
                userId: userId
            },
            {
                currentCards: difference	
            }
        )
        resolve()
    })
}

var fromDeck = (game, gameMember, selected, timestamp, nextPlayer) => {
    return new Promise( async (resolve) => {
        
        // console.log("cardsInDeck", game.cardsInDeck)
        // console.log("openedCards", game.openedCards)
        // console.log("inHand", gameMember.currentCards)
        // console.log("selected", selected)

        var difference = getDifference(gameMember, selected)

        var result = GetCards.getCards(game.cardsInDeck, 1);
        difference = difference.concat(result.cardsForPlayer)
        var openedCards = game.openedCards.concat(selected)
        await Game.findOneAndUpdate(
            {
                gameId: game.gameId
            },
            {
                cardsInDeck: result.availableCards,
                openedCards: openedCards,
                previousDroppedCards: selected,
                previousDroppedPlayer: gameMember.userName,
                currentPlayer: nextPlayer,
                lastPlayedTime: timestamp,
				lastPlayedAction: "picked up from deck"
            }
        )
        await updateDifferenceInPlayer(game.gameId, gameMember.userId, difference)

        // console.log("cardsInDeck", result.availableCards)
        // console.log("openedCards", openedCards)
        // console.log("inHand", difference)

        resolve(difference)

    })
}

var fromTop = (game, gameMember, selected, timestamp, nextPlayer) => {
    return new Promise( async (resolve) => {
        
        // console.log("cardsInDeck", game.cardsInDeck)
        // console.log("openedCards", game.openedCards)
        // console.log("inHand", gameMember.currentCards)
        // console.log("selected", selected)

        var difference = getDifference(gameMember, selected)

        var openedCards = game.openedCards
        var cardOnTop = openedCards.pop()
        difference.push(cardOnTop)

        openedCards = openedCards.concat(selected)
        
        await Game.findOneAndUpdate(
            {
                gameId: game.gameId
            },
            {
                openedCards: openedCards,
                previousDroppedCards: selected,
                previousDroppedPlayer: gameMember.userName,
                currentPlayer: nextPlayer,
                lastPlayedTime: timestamp,
				lastPlayedAction: "picked up from the top"
            }
        )
        await updateDifferenceInPlayer(game.gameId, gameMember.userId, difference)

        // console.log("cardsInDeck", game.cardsInDeck)
        // console.log("openedCards", openedCards)
        // console.log("inHand", difference)

        resolve(difference)

    })
}

var firstTurn = (game, gameMember, selected, timestamp, nextPlayer) => {
    return new Promise( async (resolve) => {
        
        // console.log("cardsInDeck", game.cardsInDeck)
        // console.log("openedCards", game.openedCards)
        // console.log("inHand", gameMember.currentCards)
        // console.log("selected", selected)

        var difference = getDifference(gameMember, selected)

        await Game.findOneAndUpdate(
            {
                gameId: game.gameId
            },
            {
                openedCards: selected,
                previousDroppedCards: selected,
                previousDroppedPlayer: gameMember.userName,
                currentPlayer: nextPlayer,
                lastPlayedTime: timestamp,
				lastPlayedAction: "dropped card(s) and started the game"
            }
        )		
        
        await updateDifferenceInPlayer(game.gameId, gameMember.userId, difference)
        
        
        // console.log("cardsInDeck", game.cardsInDeck)
        // console.log("openedCards", selected)
        // console.log("inHand", difference)

        resolve(difference)

    })
}

var playRandom = async (timestamp, gameId, userId) => {
    
    await sleep(10)
    let game = await Game.findOne({
        gameId: gameId
    })

    // if (game.createdUser.toString() != userId.toString()) {
    //     await sleep(60)
    // } else {
    //     return
    // }
    let gameMember = await GameMember.findOne({
        gameId: gameId,
        userId: userId
    })

    if (game.lastPlayedTime != timestamp) {
        console.log(`\n\n\n${gameMember.userName} has already played`)
        return
    }

    // Select cards from player
    var selected = await selectCards(userId, gameId)

    // Pick cards from deck or top
    var random = Math.random()
    var timestamp = Date.now()
    var nextPlayerIndex = (game.players.indexOf(gameMember.userId) + 1 ) % game.players.length
    var nextPlayer = game.players[nextPlayerIndex]

    if (game.openedCards.length === 0) {
        console.log(`\n\n\n${gameMember.userName} dropped ${selected} and played first turn`)
        await firstTurn(game, gameMember, selected, timestamp, nextPlayer)
    } else if (random > 0.5) {
        console.log(`\n\n\n${gameMember.userName} dropped ${selected} and picked from deck`)
        await fromDeck(game, gameMember, selected, timestamp, nextPlayer)
    } else {
        console.log(`\n\n\n${gameMember.userName} dropped ${selected} and picked from the top`)
        await fromTop(game, gameMember, selected, timestamp, nextPlayer)
    }

    // Decide if player should declare 

    playRandom(timestamp, gameId, nextPlayer)

}

module.exports = {
    playRandom: playRandom,
    firstTurn: firstTurn,
    fromDeck: fromDeck,
    fromTop: fromTop   
}