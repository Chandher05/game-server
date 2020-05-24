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
        }
        resolve({
            players: users,
            isStarted: game.isStarted
        })
    }) 
}

exports.getGameStatus = (gameId) => {
    return new Promise( async (resolve) => {
        let game = await Game.findOne({
            gameId: gameId
        })

        resolve({
            game: game
        })
    }) 
}