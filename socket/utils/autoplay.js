import { calculateScore } from './calculateScore'
import DeclareRound from './declareRound'
import PlayCard from './playCard'
import GameMember from "../src/models/mongoDB/gameMember"



var selectCards = (gameMember) => {

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
    return randomCards
}

exports.playRandom = async (gameId, userId, game, gameMember) => {
    return new Promise(async (resolve, reject) => {
        try {
            let playerTotal = calculateScore(gameMember.currentCards)
            var shouldDeclare = Math.random()

            if (playerTotal < 15 && shouldDeclare <= 0.2) {
                console.log(`\n\n\nAutoplay: ${gameMember.userName} has declared`)
                await DeclareRound(gameId, userId, true)
                return
            }

            // Select cards from player
            var selected = selectCards(gameMember)

            // Pick cards from deck or top
            var random = Math.random()
            var timestamp = Date.now()

            var activePlayers = await GameMember.find({
                gameId: gameId,
                isEliminated: false
            })
            var activePlayersIds = []
            for (var player of activePlayers) {
                activePlayersIds.push(player.userId.toString())
            }
            var nextPlayerIndex = (activePlayersIds.indexOf(userId) + 1) % activePlayersIds.length
            var nextPlayer = activePlayersIds[nextPlayerIndex]

            if (gameMember.currentCards.length === 6) {
                console.log(`\n\n\nAutoplay: ${gameMember.userName} dropped ${selected} and played first turn`)
                await PlayCard.firstTurn(game, gameMember, selected, timestamp, nextPlayer)
            } else if (random > 0.5) {
                console.log(`\n\n\nAutoplay: ${gameMember.userName} dropped ${selected} and picked from deck`)
                await PlayCard.fromDeck(game, gameMember, selected, timestamp, nextPlayer)
            } else {
                console.log(`\n\n\nAutoplay: ${gameMember.userName} dropped ${selected} and picked from the table`)
                await PlayCard.fromTop(game, gameMember, selected, timestamp, nextPlayer)
            }
            resolve()
        } catch (err) {
            reject("Error in autoplay", err)
        }
    })
}