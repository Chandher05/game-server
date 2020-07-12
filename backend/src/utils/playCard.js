import Game from '../models/mongoDB/game';
import GameMember from '../models/mongoDB/gameMember';
import GetCards from './getCards';
import CardValues from './cardValues';
import DeclareRound from './declareRound';
import RestockDeck from './restockDeck';
import GamesCache from './gamesCache';

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

        if (game.currentPlayer.toString() != gameMember.userId.toString()) {
            console.log("Not current player")
            resolve()
            return
        // } else if (GamesCache[game.gameId]) {
        //     if (GamesCache[game.gameId] != gameMember.userId) {
        //         console.log("Not current player")
        //         resolve()
        //         return
        //     }
        } 
        // GamesCache[game.gameId] = nextPlayer
        
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

        RestockDeck(game.gameId)
        resolve(difference)

    })
}

var fromTop = (game, gameMember, selected, timestamp, nextPlayer) => {
    return new Promise( async (resolve) => {

        if (game.currentPlayer.toString() != gameMember.userId.toString()) {
            console.log("Not current player")
            resolve()
            return
        // } else if (GamesCache[game.gameId]) {
        //     if (GamesCache[game.gameId] != gameMember.userId) {
        //         console.log("Not current player")
        //         resolve()
        //         return
        //     }
        } 
        // GamesCache[game.gameId] = nextPlayer

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
				lastPlayedAction: "picked up from the table"
            }
        )
        await updateDifferenceInPlayer(game.gameId, gameMember.userId, difference)

        RestockDeck(game.gameId)
        resolve(difference)

    })
}

var firstTurn = (game, gameMember, selected, timestamp, nextPlayer) => {
    return new Promise( async (resolve) => {

        if (game.currentPlayer.toString() != gameMember.userId.toString()) {
            resolve()
            return
        // } else if (GamesCache[game.gameId]) {
        //     if (GamesCache[game.gameId] != gameMember.userId) {
        //         console.log("Not current player")
        //         resolve()
        //         return
        //     }
        } 
        // GamesCache[game.gameId] = nextPlayer

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

        resolve(difference)

    })
}

var calculateScore = (cards) => {
    let total = 0
    for (var card of cards) {
        total += CardValues(card)
    }
    return total
}

var playRandom = async (timestamp, gameId, userId) => {
    
    let game = await Game.findOne({
        gameId: gameId
    })

    let gameMember = await GameMember.findOne({
        gameId: gameId,
        userId: userId
    })

    if (!game) {
        console.log(`\n\n\nGame has ended`)
        return
    } else if (game.players.includes(userId)) {
        var count = 0
        while (count < 60) {
            await sleep(1)
            count++
            game = await Game.findOne({
                gameId: gameId
            })
        
            if (!game) {
                console.log(`\n\n\nGame has ended`)
                return
            } else if (game.lastPlayedTime != timestamp) {
                console.log(`\n\n\n${gameMember.userName} has already played`)
                return
            } else if (game.isRoundComplete == true) {
                console.log("\n\n\nRound has ended")
                return
            } else if (game.isEnded == true) {
                console.log("\n\n\nGame has ended")
                return
            }
        }
    } else {
        await sleep(2)
    }
    
    let playerTotal = calculateScore(gameMember.currentCards)
    var shouldDeclare = Math.random()
    
    if (playerTotal < 15 && shouldDeclare <= 0.2) {
        console.log(`\n\n\n${gameMember.userName} has declared`)
        await DeclareRound(gameId, userId, true)
        return
    }

    // Select cards from player
    var selected = await selectCards(userId, gameId)

    // Pick cards from deck or top
    var random = Math.random()
    var timestamp = Date.now()

    var activePlayers = await GameMember.find({
        gameId: gameId,
        isAlive: true
    })
    var activePlayersIds = []
    for (var player of activePlayers) {
        activePlayersIds.push(player.userId.toString())
    }
    var nextPlayerIndex = (activePlayersIds.indexOf(userId) + 1 ) % activePlayersIds.length
    var nextPlayer = activePlayersIds[nextPlayerIndex]

    if (gameMember.currentCards.length === 6) {
        console.log(`\n\n\n${gameMember.userName} dropped ${selected} and played first turn`)
        await firstTurn(game, gameMember, selected, timestamp, nextPlayer)
    } else if (random > 0.5) {
        console.log(`\n\n\n${gameMember.userName} dropped ${selected} and picked from deck`)
        await fromDeck(game, gameMember, selected, timestamp, nextPlayer)
    } else {
        console.log(`\n\n\n${gameMember.userName} dropped ${selected} and picked from the table`)
        await fromTop(game, gameMember, selected, timestamp, nextPlayer)
    }

    playRandom(timestamp, gameId, nextPlayer)

}

module.exports = {
    playRandom: playRandom,
    firstTurn: firstTurn,
    fromDeck: fromDeck,
    fromTop: fromTop   
}