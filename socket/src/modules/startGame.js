import Game from '../models/mongoDB/game'
import GameMember from '../models/mongoDB/gameMember'
import Users from '../models/mongoDB/users'

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