import cron from "node-cron"
import Game from "../src/models/mongoDB/game"
import GameMember from "../src/models/mongoDB/gameMember"
import { emitLobbyDataToAllInGame, emitDataToAllInGame } from '../src/modules/sendUpdates'
import { playRandom } from './autoplay'

cron.schedule("*/5 * * * * *", async () => {
    // var func = async () => {
    try {

        let timestamp = Date.now()
        let activeGames = await Game.find({
            isEnded: false
        })

        let gameId
        let currentGameMemberForGame
        for (var gameObj of activeGames) {
            gameId = gameObj.gameId

            if (!gameObj.isStarted) {
                return await emitLobbyDataToAllInGame(gameId)
            } else if (gameObj.isRoundComplete) {
                if (timestamp - gameObj.lastPlayedTime > 1000 * 1000) {
                    await Game.updateOne(
                        {
                            gameId: gameId
                        },
                        {
                            isEnded: true
                        }
                    )
                } else {
                    return await emitDataToAllInGame(gameId)
                }
            }

            currentGameMemberForGame = await GameMember.findOne({
                gameId: gameId,
                userId: gameObj.currentPlayer
            })

            // if (currentGameMemberForGame.didPlayerLeave) {
            //     await playRandom(gameId, gameObj.currentPlayer.toString(), gameObj, currentGameMemberForGame)
            // } else if (timestamp - gameObj.lastPlayedTime > 60 * 1000) {
            //     await playRandom(gameId, gameObj.currentPlayer.toString(), gameObj, currentGameMemberForGame)
            // }
            return await emitDataToAllInGame(gameId)

        }
    } catch (err) {
        if (err.message) {
            console.log("Cron job err 1", err.message)
        }
        console.log("Cron job err", err)
    }
    // }
})

// func()