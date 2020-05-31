import Game from '../models/mongoDB/game'
import GameMember from '../models/mongoDB/gameMember'
import Users from '../models/mongoDB/users'
import calculateScore from '../../utils/calculateScore'

exports.getPlayersInGame = (gameId) => {
    return new Promise( async (resolve) => {
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

exports.getGameStatus = (gameId, userId) => {
    return new Promise( async (resolve) => {
        let game = await Game.findOne({
            gameId: gameId
        })

        let gameMember = await GameMember.findOne({
            gameId: gameId,
            userId: userId
        })

        resolve({
            game: game,
            gameMember: gameMember
        })
    }) 
}

exports.playerScores = (gameId) => {
    return new Promise( async (resolve) => {
        let gameMembers = await GameMember.find({
            gameId: gameId
        })

        let allScores = [],
            data
        for (var player of gameMembers) {
            data = {
                userName: player.userName,
                score: player.score,
                roundScores: player.roundScores
            }
            allScores.push(data)
        }
        resolve(allScores)
    })
} 

exports.getOtherPlayers = (gameId) => {
    return new Promise( async (resolve) => {
        let game = await Game.findOne({
            gameId: gameId
        })

        let gameMembers = await GameMember.find({
            gameId: gameId
        })

        resolve({
            game: game,
            gameMembers: gameMembers
        })
    }) 
}


exports.getGameStatus = (gameId, userId) => {
    return new Promise(async (resolve) => {
        let game = await Game.findOne({
            gameId: gameId
        })

        let allGameMembers = await GameMember.find({
            gameId: gameId
        })

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

        if (!game || !allGameMembers || !gameMember) {
            resolve(null)
        }

        let allCards = {}
        for (var player of allGameMembers) {
            allCards[player.userId] = {
                userName: player.userName,
                count: player.currentCards.length,
                hasQuit: game.players.includes(player.userId) ? false : true,
                score: calculateScore(player.currentCards)
            }
        }

        resolve({
            game: game,
            gameMember: gameMember,
            allScores: allScores,
            allGameMembers: allGameMembers,
            allCards: allCards
        })
    })
}


exports.getSpectateStatus = (gameId) => {
    return new Promise(async (resolve) => {
        let game = await Game.findOne({
            gameId: gameId
        })

        let allGameMembers = await GameMember.find({
            gameId: gameId
        })

        let allScores = [],
            data

        for (var player of allGameMembers) {
            data = {
                userName: player.userName,
                score: player.score,
                roundScores: player.roundScores
            }
            allScores.push(data)
        }

        if (!game || !allGameMembers) {
            resolve(null)
        }

        let allCards = {}
        for (var player of allGameMembers) {
            allCards[player.userId] = {
                userName: player.userName,
                count: player.currentCards.length,
                hasQuit: game.players.includes(player.userId) ? false : true,
                score: calculateScore(player.currentCards)
            }
        }

        resolve({
            game: game,
            allScores: allScores,
            allGameMembers: allGameMembers,
            allCards: allCards
        })
    })
}