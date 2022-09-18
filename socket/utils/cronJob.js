import cron from "node-cron"
import Game from "../src/models/mongoDB/game"
import GameMember from "../src/models/mongoDB/gameMember"
import { emitLobbyDataToAllInGame, emitDataToAllInGame } from '../src/modules/sendUpdates'
import { playRandom } from './autoplay'
import { sysidConnected, userid_useruid, useruid_sysid, useruid_userid } from '../utils/trackConnections'


cron.schedule("*/5 * * * * *", async () => {
    
    try {

        let timestamp = Date.now()
        let activeGames = await Game.find({
            isEnded: false
        })

        let gameId
        let currentGameMemberForGame
        let autoplayPlayerUID, autoplayPlayerSysId, autoplayPlayerSocket
        for (var gameObj of activeGames) {
            gameId = gameObj.gameId

            if (!gameObj.isStarted) {
                await emitLobbyDataToAllInGame(gameId)
                continue
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
                    await emitDataToAllInGame(gameId)
                }
                continue
            }

            currentGameMemberForGame = await GameMember.findOne({
                gameId: gameId,
                userId: gameObj.currentPlayer
            })

            if (currentGameMemberForGame.didPlayerLeave) {
                await playRandom(gameId, gameObj.currentPlayer.toString(), gameObj, currentGameMemberForGame)
            } else if (timestamp - gameObj.lastPlayedTime > gameObj.autoplayTimer * 1000) {
                await playRandom(gameId, gameObj.currentPlayer.toString(), gameObj, currentGameMemberForGame)
                currentGameMemberForGame = await GameMember.findOne({
                    gameId: gameId,
                    userId: gameObj.currentPlayer
                })

                if (gameObj.currentPlayer in userid_useruid) {
                    autoplayPlayerUID = userid_useruid[gameObj.currentPlayer]
                }
                if (autoplayPlayerUID in useruid_sysid) {
                    autoplayPlayerSysId = useruid_sysid[autoplayPlayerUID]
                    autoplayPlayerSysId = [...autoplayPlayerSysId]
                    for (var sysid of autoplayPlayerSysId) {
                        autoplayPlayerSocket = sysidConnected[sysid]["socket"]
                        autoplayPlayerSocket.emit('cards-in-hand', "SUCCESS", currentGameMemberForGame.currentCards)
                    }
                }
            }
            await emitDataToAllInGame(gameId)
        }
    } catch (err) {
        if (err.message) {
            console.log("Cron job err 1", err.message)
        }
        console.log("Cron job err", err)
    }
    
})

// cron.schedule("0 0 0 */1 * *", async () => {
//     try {
//         let timestamp = Date.now()
//         timestamp = timestamp - (24 * 60 * 60 * 1000)
//         let oldGames = await Game.find({
//             lastPlayedTime: {
// 				$lte: timestamp
// 			}
//         }) 
//         await Game.deleteMany({
//             lastPlayedTime: {
// 				$lte: timestamp
// 			}
//         })
//         for (var gameObj of oldGames) {
//             console.log(`Deleted game data from database ${gameObj.gameId}`)
//             await GameMember.deleteMany({
//                 gameId: gameObj.gameId
//             })
//         }
//     } catch (err) {
//         console.log("Error in daily cron job", err.message)
//     }
// })