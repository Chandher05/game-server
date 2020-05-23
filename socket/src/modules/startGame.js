import Game from '../models/mongoDB/game'
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
        resolve(users)
    }) 
}