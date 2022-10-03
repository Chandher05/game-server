import Game from '../models/mongoDB/game';
import Users from '../models/mongoDB/users';
import GameMember from '../models/mongoDB/gameMember';
import { calculateScore } from '../../utils/calculateScore'
import roundStatus from '../../utils/roundStatus';
import { emitToUserUID, emitToUserId } from './emitter'
import { sysidConnected, userid_useruid, useruid_sysid, useruid_userid } from '../../utils/trackConnections'



exports.emitLobbyDataToAllInGame = (gameId) => {

    return new Promise(async (resolve, reject) => {
        try {
            var game = await Game.findOne({ gameId: gameId })
            if (!game) {
                reject("Could not send update. Invalid game id")
            } else if (!game.isStarted) {
                let playersInGame = game.players
                let playerObj
                let allPlayers = {}
                let playerUID = []
                let isAdmin = false
                allPlayers["players"] = []
                for (var id of playersInGame) {
                    playerObj = await Users.findById(id)
                    isAdmin = playerObj._id.toString() === game.createdUser.toString() ? true : false
                    allPlayers["players"].push({
                        id: playerObj._id.toString(),
                        userName: playerObj.userName,
                        isAdmin: isAdmin
                    })
                    playerUID.push(playerObj.userUID)
                }
                for (var id of playersInGame) {
                    allPlayers.isAdmin = id.toString() === game.createdUser.toString() ? true : false
                    allPlayers.maxScore = game.maxScore
                    allPlayers.endWithPair = game.endWithPair
                    allPlayers.wrongCall = game.wrongCall
                    allPlayers.canDeclareFirstRound = game.canDeclareFirstRound
                    allPlayers.autoplayTimer = game.autoplayTimer
                    allPlayers.isPublicGame = game.isPublicGame
                    emitToUserId(id, 'lobby-listener', "WAITING", allPlayers)
                }
                resolve()
            } else if (game.isStarted && !game.isEnded) {
                for (var id of game.players) {
                    emitToUserUID(userid_useruid[id], 'lobby-listener', "GAME_STARTED")
                }
                resolve()
            }
            resolve()
        } catch (err) {
            reject("Could not send update. ".concat(err.message))
        }
    })

}

exports.emitDataToAllInGame = (gameId) => {

    return new Promise(async (resolve, reject) => {
        try {
            var game = await Game.findOne({ gameId: gameId })
            if (!game) {
                reject("Could not send update. Invalid game id")
            } else if (!game.isStarted) {
                reject("Could not send update. Game has not started")
            }

            let playersInGame = game.players
            let playerObj
            let allPlayers = {}
            let isAdmin = false
            for (var id of playersInGame) {
                playerObj = await Users.findById(id)
                isAdmin = playerObj._id.toString() === game.createdUser.toString() ? true : false
                allPlayers[playerObj._id.toString()] = {
                    userName: playerObj.userName,
                    isAdmin: isAdmin
                }
            }

            var allGameMembers = await GameMember.find({
                gameId: gameId
            })

            let memberUserId
            let playerData
            let arrOfPlayers = []
            let hasCurrentPlayerDroppedCards

            for (var member of allGameMembers) {
                memberUserId = member.userId.toString()
                if (memberUserId in allPlayers) {
                    allPlayers[memberUserId]["hasPlayerLeft"] = member.didPlayerLeave
                } else {
                    allPlayers[memberUserId] = {
                        userName: member.userName,
                        isAdmin: false,
                        hasPlayerLeft: true
                    }
                }

                if (member.isEliminated) {
                    allPlayers[memberUserId]["isEliminated"] = true
                    allPlayers[memberUserId]["cardsInHand"] = 0
                    allPlayers[memberUserId]["roundScore"] = null
                } else {
                    allPlayers[memberUserId]["isEliminated"] = false
                    if (game.isRoundComplete) {
                        allPlayers[memberUserId]["cardsInHand"] = 0
                        allPlayers[memberUserId]["roundScore"] = calculateScore(member.currentCards)
                    } else {
                        allPlayers[memberUserId]["cardsInHand"] = member.currentCards.length
                        allPlayers[memberUserId]["roundScore"] = null
                    }

                }
                if (memberUserId === game.currentPlayer.toString()) {
                    hasCurrentPlayerDroppedCards = member.hasPlayerDroppedCards
                }

                allPlayers[memberUserId]["currentPlayer"] = memberUserId.toString() === game.currentPlayer.toString() ? true : false
                allPlayers[memberUserId]["totalScore"] = member.score
                allPlayers[memberUserId]["previousScores"] = member.roundScores
                playerData = allPlayers[memberUserId]
                playerData["userId"] = memberUserId
                arrOfPlayers.push(playerData)
            }

            let playerDeclaredType
            if (game.isRoundComplete) {
                let playerTotals = roundStatus(allGameMembers)
                playerTotals = playerTotals[game.currentPlayer.toString()]
                if (playerTotals.isPair) {
                    playerDeclaredType = "PAIR"
                } else if (playerTotals.isSame) {
                    playerDeclaredType = "SAME"
                } else if (playerTotals.isLowest) {
                    playerDeclaredType = "LOWEST"
                } else {
                    playerDeclaredType = "NOT_LOWEST"
                }
            }

            let waitingPlayers = []
            let waitingPlayerObj
            for (var member of game.waiting) {
                waitingPlayerObj = await Users.findById(member._id)
                waitingPlayers.push(waitingPlayerObj.userName)
            }
            let data = {
                lastPlayedUser: game.previousDroppedPlayer,
                lastPlayedAction: game.lastPlayedAction,
                discardPile: game.previousDroppedCards,
                // playerStatus: "", // PLAYING, WAITING, SPECTATING
                isRoundComplete: game.isRoundComplete,
                playerDeclaredType: game.isRoundComplete ? playerDeclaredType : "", // PAIR, LOWEST, SAME, HIGHEST
                isGameComplete: game.isEnded,
                waitingPlayers: game.isEnded ? waitingPlayers : [],
                // currentPlayer: game.currentPlayer.toString(),
                players: arrOfPlayers,
                // isAdmin: null
                canPlayersDeclare: hasCurrentPlayerDroppedCards || game.canDeclareFirstRound
            }

            for (var userId of game.players) {
                data["playerStatus"] = "PLAYING"
                data["isAdmin"] = userId.toString() === game.createdUser.toString() ? true : false
                data["currentPlayer"] = userId.toString() === game.currentPlayer.toString() ? true : false
                data["userId"] = userId.toString()
                emitToUserUID(userid_useruid[userId], 'common-game-data', "SUCCESS", data)
            }

            for (var userId of game.waiting) {
                data["playerStatus"] = "WAITING"
                data["isAdmin"] = false
                data["userId"] = userId.toString()
                emitToUserUID(userid_useruid[userId], 'common-game-data', "SUCCESS", data)
            }

            for (var userId of game.spectators) {
                data["playerStatus"] = "SPECTATING"
                data["isAdmin"] = false
                data["userId"] = userId.toString()
                emitToUserUID(userid_useruid[userId], 'common-game-data', "SUCCESS", data)
            }

            resolve()
        } catch (err) {
            reject("Could not send update. ".concat(err.message))
        }
    })

}