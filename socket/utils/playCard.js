import Game from '../src/models/mongoDB/game';
import GameMember from '../src/models/mongoDB/gameMember';
import RestockDeck from './restockDeck';

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

var getLeftOverCards = (gameMember, selected) => {

    var difference = []
    for (var card of gameMember.currentCards) {
        if (selected.includes(card) == false) {
            difference.push(card)
        }
    }
    return difference
}

var updateDifferenceInPlayer = (gameId, userId, difference) => {
    return new Promise(async (resolve) => {
        await GameMember.updateOne(
            {
                gameId: gameId,
                userId: userId
            },
            {
                hasPlayerDroppedCards: true,
                currentCards: difference
            }
        )
        resolve()
    })
}

var fromDeck = (game, gameMember, selected, timestamp, nextPlayer) => {
    return new Promise(async (resolve, reject) => {

        if (game.currentPlayer.toString() != gameMember.userId.toString()) {
            reject("Not current player")
            return
        }

        var difference = getLeftOverCards(gameMember, selected)
        difference = difference.concat([game.cardsInDeck.pop()])

        var openedCards = game.openedCards.concat(selected)
        await Game.updateOne(
            {
                gameId: game.gameId
            },
            {
                cardsInDeck: game.cardsInDeck,
                openedCards: openedCards,
                previousDroppedCards: selected,
                previousDroppedPlayer: gameMember.userName,
                currentPlayer: nextPlayer,
                lastPlayedTime: timestamp,
                lastPlayedAction: "picked up from deck"
            }
        )
        await updateDifferenceInPlayer(game.gameId, gameMember.userId, difference)

        RestockDeck(game.gameId)
        resolve(difference)

    })
}

var fromTop = (game, gameMember, selected, timestamp, nextPlayer) => {
    return new Promise(async (resolve, reject) => {

        if (game.currentPlayer.toString() != gameMember.userId.toString()) {
            reject("Not current player")
            return
        }

        var difference = getLeftOverCards(gameMember, selected)

        var openedCards = game.openedCards
        var cardOnTop = openedCards.pop()
        difference.push(cardOnTop)

        openedCards = openedCards.concat(selected)

        await Game.updateOne(
            {
                gameId: game.gameId
            },
            {
                openedCards: openedCards,
                previousDroppedCards: selected,
                previousDroppedPlayer: gameMember.userName,
                currentPlayer: nextPlayer,
                lastPlayedTime: timestamp,
                lastPlayedAction: "picked up from the table"
            }
        )
        await updateDifferenceInPlayer(game.gameId, gameMember.userId, difference)

        RestockDeck(game.gameId)
        resolve(difference)

    })
}

var firstTurn = (game, gameMember, selected, timestamp, nextPlayer) => {
    return new Promise(async (resolve, reject) => {

        try {
            if (game.currentPlayer.toString() != gameMember.userId.toString()) {
                reject("Not current player")
                return
            }

            var difference = getLeftOverCards(gameMember, selected)

            await Game.updateOne(
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

            resolve(difference)
        } catch (err) {
            reject(err)
            return
        }

    })
}


module.exports = {
    firstTurn: firstTurn,
    fromDeck: fromDeck,
    fromTop: fromTop
}