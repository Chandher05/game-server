import Game from '../models/mongoDB/game'
import GameMember from '../models/mongoDB/gameMember'
import Users from '../models/mongoDB/users'
import calculateScore from '../../utils/calculateScore'
import RoundStatus from '../../utils/roundStatus'
import { resolve } from 'path'

exports.getPlayersInGame = (gameId) => {
    return new Promise(async (resolve) => {
        let game = await Game.findOne({
            gameId: gameId
        })
        let users = []
        if (game) {
            for (var userId of game.players) {
                let player = await Users.findById(userId)
                users.push(player)
            }
            resolve({
                createdUser: game.createdUser,
                players: users,
                isStarted: game.isStarted
            })
        }
        resolve({
            players: users,
            isStarted: false
        })
    })
}


exports.getGameStatus = (gameId, userId, game, allGameMembers) => {
    return new Promise(async (resolve) => {

        if (!game || !allGameMembers) {
            resolve(null)
            return
        }

        let allScores = [],
            data,
            gameMember

        for (var player of allGameMembers) {
            if (player.userId.toString() == userId && game.players.includes(player.userId)) {
                gameMember = player
            }
            data = {
                userName: player.userName,
                score: player.score,
                roundScores: player.roundScores
            }
            allScores.push(data)
        }

        let allCards = {}
        for (var player of allGameMembers) {
            allCards[player.userId] = {
                userName: player.userName,
                count: player.currentCards.length,
                hasQuit: game.players.includes(player.userId) ? false : true,
                score: game.isRoundComplete === true ? calculateScore(player.currentCards) : null
            }
        }

        let waitingPlayers = []
        // if (game.isEnded == true) {
            for (var waitingPlayer of game.waiting) {
                let playerDetails = await Users.findById(waitingPlayer)
                waitingPlayers.push(playerDetails.userName)
            }
        // } 

        resolve({
            game: game,
            gameMember: gameMember,
            allScores: allScores,
            allGameMembers: allGameMembers,
            allCards: allCards,
            roundStatus: game.isRoundComplete === true ? RoundStatus(allGameMembers) : null,
            waitingPlayers: waitingPlayers
        })
    })
}

exports.isUserPartOfGame = (userId) => {

    return new Promise(async (resolve, reject) => {
        let game = await Game.findOne({
            $or: [{ players: userId }, { spectators: userId }, {waiting: userId}],
            // players: userId,
            isStarted: true,
            isEnded: false
        })
        if (game) {
            resolve(game.gameId)
        } else {
            resolve(null)
        }
    })
}


exports.isGameEnded = (gameId) => {

    return new Promise(async (resolve, reject) => {
        let game = await Game.findOne({
            gameId: gameId
        })
        if (!game) {
            resolve(true)
        } else {
            resolve(game.isEnded)
        }
    })
}


exports.playersInGame = (gameData) => {

    return new Promise(async (resolve, reject) => {
        var players = new Set([])
        if (gameData) {
            for (var userId of gameData.players) {
                players.add(userId.toString())
            }
            for (var userId of gameData.spectators) {
                players.add(userId.toString())
            }
            for (var userId of gameData.waiting) {
                players.add(userId.toString())
            }
        }
        resolve(players)
    })
}

exports.activeGames = () => {
    return new Promise(async (resolve, reject) => {
        var allGames = await Game.find({
            isStarted: true,
            isEnded: false
        })
        resolve (allGames)
    })
}

exports.notStartedGames = () => {
    return new Promise(async (resolve, reject) => {
        var allGames = await Game.find({
            isStarted: false,
            isEnded: false
        })
        resolve (allGames)
    })
}

exports.endGame = (gameId) => {
    return new Promise(async (resolve, reject) => {
        await Game.updateOne(
            {
                gameId: gameId
            },
            {
            isStarted: false,
            isEnded: true
        })
        resolve ()
    })
}

exports.removeSpectator = (userId, gameId) => {
    return new Promise(async(resolve, reject) => {
        await Game.updateOne(
            {
                gameId: gameId
            },
            {
                $pull: {
                    spectators: userId
                }
            }
        )
        resolve()
    })
}

exports.addSpectator = (userId, gameId) => {
    return new Promise(async(resolve, reject) => {
        await Game.updateOne(
            {
                gameId: gameId
            },
            {
                $push: {
                    spectators: userId
                }
            }
        )
        resolve()
    })
}