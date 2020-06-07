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
                        isRoundComplete: data.game.isRoundComplete,
                        isEnded: data.game.isEnded,
                        action: data.game.lastPlayedAction
                    }
    
                    let returnValue = {
                        currentCards: currentCards,
                        scores: data.allScores,
                        allPlayers: allPlayers
                    }
                    
                    client.emit('commonGameData', returnValue)
    
                    if (data.gameMember) {
                        
                        let currentPlayerData = {
                            currentPlayer: data.game.currentPlayer,
                            playerCards: data.gameMember.currentCards,
                            isRoundComplete: data.game.isRoundComplete,
                            isGameComplete: data.game.isEnded,
                            hostPlayer: data.game.createdUser
                        }

                        client.emit('currentPlayer', currentPlayerData)
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