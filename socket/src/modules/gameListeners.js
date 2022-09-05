import Game from '../models/mongoDB/game'
import GameMember from '../models/mongoDB/gameMember'
import Users from '../models/mongoDB/users'
import GenerateId from '../../utils/generateId'


var GameListeners = (socket, allsockets, allUsers) => {


    socket.on('create-game', async (authId, params) => {
        try {
            const userUID = socket.handshake.userUID
            const email = socket.handshake.email
            const userName= socket.handshake.displayName
            if (userUID) {
                const userId = allUsers[userUID]
                if (!userId) {
                    socket.emit('common-error-response', "USER_NOT_REGISTERED_IN_BACKEND")
                    return
                }

                let game
                game = await Game.find({
                    players: userId,
                    isStarted: true,
                    isEnded: false
                })
                if (game.length > 0) {
                    socket.emit('common-error-response', "USER_IS_PLAYING_A_GAME")
                }
                
                game = await Game.find({
                    isStarted: true,
                    isEnded: false
                })
        
                if (game.length > 5) {
                    socket.emit('common-error-response', "FIVE_ACTIVE_GAMES_LIMIT_REACHED")
                }
        
                game = await Game.findOne({
                    players: userId,
                    isStarted: false,
                    isEnded: false
                })
                if (game) {
                    let playersInLobbyObj = await Users.find({
                        _id: {
                            $in: game.players
                        }
                    })
                    let playersInLobby = []
                    let createdUser = ""
                    let createdUserUID = ""
                    for (var player of playersInLobbyObj) {
                        playersInLobby.push(player.userName)
                        if (player._id.toString() === game.createdUser.toString()) {
                            createdUser = player.userName
                            createdUserUID = player.userUID
                        }
                    }
                    socket.emit('global-user-status', "LOBBY", {
                        gameId: game.gameId,
                        createdUserUID: createdUserUID,
                        createdUser: createdUser,
                        playersInLobby: playersInLobby
                    })
                    return
                }
        
                let gameId = await GenerateId(6)
                const gameData = new Game({
                    players: [userId],
                    gameId: gameId,
                    createdUser: userId,
                    currentPlayer: userId,
                    cardsInDeck: [],
                    openedCards: [],
                    previousDroppedCards: [],
                    previousDroppedPlayer: " ",
                    lastPlayedTime: " ",
                    lastPlayedAction: " "
                })
        
                await gameData.save()
                let userObj = await Users.findById(userId)

                socket.emit('global-user-status', "LOBBY", {
                    gameId: gameData.gameId,
                    createdUserUID: userUID,
                    createdUser: userObj.userName,
                    playersInLobby: [userObj.userName],
                })
            } else {
                console.log("Invalid auth: claim-username")
                socket.disconnect(true)
            }
        } catch (err) {
            socket.emit('common-error-response', "ERROR", err.message)
        }
    })

    
    socket.on('leave-lobby', async (authId, params) => {
        try {
            const userUID = socket.handshake.userUID
            const email = socket.handshake.email
            const userName= socket.handshake.displayName
            if (userUID) {
                
                let game
                game = await Game.findOne({
                    gameId: params.gameId
                })
                if (!game) {
                    socket.emit('leave-lobby-response', "ERROR")
                    return
                }
                
                if (params.userId === game.createdUser.toString()) {
                    await Game.deleteOne({
                        gameId: params.gameId
                    })
                } else {
                    await Game.updateOne(
                        {
                            gameId: params.gameId
                        },
                        {
                            $pull: {
                                players: params.userId
                            }
                        }
                    )
                }

                // TODO Send update to all players in the game

            } else {
                console.log("Invalid auth: leave-lobby")
                socket.disconnect(true)
            }
        } catch (err) {
            socket.emit('common-error-response', "ERROR", err.message)
        }
    })

    socket.on('join-game', async (authId, params) => {
        try {
            const userUID = socket.handshake.userUID
            const email = socket.handshake.email
            const userName= socket.handshake.displayName
            if (userUID) {
                const userId = allUsers[userUID]
                if (!userId) {
                    socket.emit('common-error-response', "USER_NOT_REGISTERED_IN_BACKEND")
                    return
                }

                let game
                game = await Game.findOne({
                    gameId: params.gameId
                })
                if (!game) {
                    socket.emit('common-error-response', "INVALID_GAME_ID")
                    return 
                } else if (game.players.includes(userId)) {
                    socket.emit('common-error-response', "USER_ALREADY_PLAYING_GAME")
                    socket.emit('global-user-status', "GAME_ROOM", "PLAYER_DATA. User is playing the game!")
                    return 
                } else if (game.players.length + game.waiting.length === 5) {
                    socket.emit('common-error-response', "GAME_HAS_REACHED_FIVE_PLAYER_LIMIT")
                    return 
                } else if (game.isStarted == true) {
        
                    game = await Game.findOne({
                        gameId: params.gameId,
                        $or: [{players: userId}, {waiting: userId}],
                        isEnded: false
                    })
                    if (game) {
                        socket.emit('common-error-response', "USER_HAS_ALREADY_JOINED_GAME")
                        socket.emit('global-user-status', "GAME_ROOM", "SPECTATING_DATA. User late joined")
                        return 
                    }
        
                    game = await Game.findOneAndUpdate(
                        {
                            gameId: params.gameId
                        },
                        {
                            $pull: {
                                waiting: userId
                            }
                        }
                    )
            
                    game = await Game.findOneAndUpdate(
                        {
                            gameId: params.gameId
                        },
                        {
                            $push: {
                                waiting: userId
                            }
                        }
                    )
                    socket.emit('global-user-status', "GAME_ROOM", "SPECTATING_DATA. User late joined")
                    return 
                }
                    
                game = await Game.findOne({
                    gameId: params.gameId,
                    $or: [{players: userId}, {waiting: userId}],
                    isEnded: false
                })
                if (game) {
                    socket.emit('common-error-response', "USER_HAS_ALREADY_JOINED_GAME")
                    socket.emit('global-user-status', "GAME_ROOM", "PLAYER_DATA")
                    return
                }
        
                game = await Game.findOneAndUpdate(
                    {
                        gameId: params.gameId
                    },
                    {
                        $pull: {
                            players: userId
                        }
                    }
                )
        
                game = await Game.findOneAndUpdate(
                    {
                        gameId: params.gameId
                    },
                    {
                        $push: {
                            players: userId
                        }
                    }
                )
        
                socket.emit('global-user-status', "GAME_ROOM", "PLAYER_DATA. JOINED GAME")
                return 

            } else {
                console.log("Invalid auth: claim-username")
                socket.disconnect(true)
            }
        } catch (err) {
            socket.emit('common-error-response', "ERROR", err.message)
        }
    })

    socket.on('spectateGame', async (userId, gameId) => {

        console.log('spectateGame')
        allSpecators[userId] = gameId
        await startGame.addSpectator(userId, gameId)
        console.log("Spectator connected to " + gameId)

    })

    socket.on('getPlayers', async (gameId) => {
        console.log('getPlayers')
        await sendWaitingScreenData(gameId)
    })


    socket.on('removePlayer', async (userId, gameId) => {
        console.log('removePlayer')
        let users = await startGame.getPlayersInGame(gameId)
        if (userId && allsockets[userId]) {
            allsockets[userId].emit('playersInGame', users)
        }
        await sendWaitingScreenData(gameId)
    })


    socket.on('getGameStatus', async (gameId, userId) => {

        // console.log('getGameStatus')
        allsockets[userId] = socket
        socketIDS[socket.id] = userId

        let game = await Game.findOne({
            gameId: gameId
        })

        let allGameMembers = await GameMember.find({
            gameId: gameId
        })

        let waitingPlayers = []
        for (var waitingPlayer of game.waiting) {
            let playerDetails = await Users.findById(waitingPlayer)
            waitingPlayers.push(playerDetails.userName)
        }

        sendData(socket, gameId, userId, game, allGameMembers, waitingPlayers) 
    })

    
    socket.on('pushCommonData', async (gameId, userId) => {
            
        try {
            // console.log('pushCommonData')
            let gameData = await Game.findOne({
                gameId: gameId
            })
            if (!gameData) {
                return
            }
            
            var allPlayers = await startGame.playersInGame(gameData)
    
            let allGameMembers = await GameMember.find({
                gameId: gameId
            })

            let waitingPlayers = []
            for (var waitingPlayer of gameData.waiting) {
                let playerDetails = await Users.findById(waitingPlayer)
                waitingPlayers.push(playerDetails.userName)
            }
            
            console.log("Sending data to players of game " + gameId)
            for (var userId of allPlayers) {
                if (allsockets[userId]) {
                    sendData(allsockets[userId], gameId, userId, gameData, allGameMembers, waitingPlayers)
                }
            }
        } catch (error) {

        }

    });

    
}

export default GameListeners