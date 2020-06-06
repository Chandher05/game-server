import startGame from './startGame'

var socketListener = (io) => {
    //Whenever someone connects this gets executed
    io.on('connection', function (client) {
        console.log('A user connected');

        try {
            client.on('getPlayers', async (gameId) => {
                let users = await startGame.getPlayersInGame(gameId)
                client.emit('playersInGame', users)
            })
        } catch (error) {

        }

        try {
            client.on('getGameStatus', async (gameId, userId) => {
                let data,
                    game
                if (userId != undefined) {

                    game = await startGame.getGameStatus(gameId, userId)

                    try {
                        data = {
                            cardOnTop: game.game.openedCards.pop(),
                            previousDroppedCards: game.game.previousDroppedCards,
                            previousDroppedPlayer: game.game.previousDroppedPlayer,
                            action: game.game.lastPlayedAction
                        }
                        client.emit('currentCards', data)
                    } catch (error) {
                        // console.log("Error in getGameStatus/currentCards")
                    }

                    try {
                        data = {
                            currentPlayer: game.game.currentPlayer,
                            playerCards: game.gameMember.currentCards,
                            isRoundComplete: game.game.isRoundComplete,
                            isGameComplete: game.game.isEnded,
                            hostPlayer: game.game.createdUser
                        }

                        client.emit('currentPlayer', data)
                    } catch (error) {
                        // console.log("Error in getGameStatus/currentPlayer")
                    }
                }
            })
        } catch (error) {
            // console.log("Error in getGameStatus")
        }

        try {
            client.on('getScores', async (gameId) => {
                let scores = await startGame.playerScores(gameId)
                client.emit('score', scores)
            })
        } catch (error) {

        }

        try {
            client.on('getOtherPlayers', async (gameId) => {
                let data = await startGame.getOtherPlayers(gameId)

                let allCards = {}
                if (data.gameMembers) {
                    for (var player of data.gameMembers) {
                        // console.log(player.currentCards)
                        allCards[player.userId] = {
                            userName: player.userName,
                            count: player.currentCards.length,
                            hasQuit: data.game.players.includes(player.userId) ? false : true
                        }
                    }
                }

                data = {
                    currentPlayer: data.game.currentPlayer,
                    playerCards: allCards,
                    hostPlayer: data.game.createdUser,
                    gameStatus: data.game.isRoundComplete,
                    player: data.game.previousDroppedPlayer,
                    action: data.game.lastPlayedAction
                }
                client.emit('allPlayers', data)
            })
        } catch (error) {

        }
        
        try {
            client.on('getGameStatus', async (gameId, userId) => {
                let data = await startGame.getGameStatus(gameId, userId)
                if (data) { 
                    let currentCards = {
                        cardOnTop: data.game.openedCards.pop(),
                        previousDroppedCard: data.game.previousDroppedCards,
                        previousDroppedPlayer: data.game.previousDroppedPlayer,
                        action: data.game.lastPlayedAction
                    }
    
                    let allPlayers = {
                        currentPlayer: data.game.currentPlayer,
                        cardsCount: data.allCards,
                        hostPlayer: data.game.createdUser,
                        isRoundComplete: data.game.isRoundComplete,
                        player: data.game.previousDroppedPlayer,
                        action: data.game.lastPlayedAction
                    }
    
                    if (data.gameMember) {
                        
                        let currentPlayer = {
                            currentPlayer: data.game.currentPlayer,
                            playerCards: data.gameMember.currentCards,
                            isRoundComplete: data.game.isRoundComplete,
                            isGameComplete: data.game.isEnded,
                            hostPlayer: data.game.createdUser
                        }
                        let returnValue = {
                            currentCards: currentCards,
                            currentPlayer: currentPlayer,
                            scores: data.allScores,
                            allPlayers: allPlayers
                        }
                        client.emit('status', returnValue)
                    } else {
    
                        let returnValue = {
                            currentCards: currentCards,
                            scores: data.allScores,
                            allPlayers: allPlayers
                        }
                        
                        client.emit('spectate', returnValue)

                    }
                } 
            })
        } catch (error) {

        }


        //Whenever someone disconnects this piece of code executed
        client.on('disconnect', function () {
            console.log('A user disconnected');
        });
    });
}

export default socketListener;