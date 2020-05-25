import startGame from './startGame'

var socketListener = (io) => {
    //Whenever someone connects this gets executed
    io.on('connection', function (client) {
        console.log('A user connected');
    
        client.on('getPlayers', async (gameId) => {
            let users = await startGame.getPlayersInGame(gameId)
            client.emit('playersInGame', users)
        })
        
        client.on('getGameStatus', async (gameId, userId) => {
            let data,
                game 
            if (userId != undefined) {
                game = await startGame.getGameStatus(gameId, userId)

                data = {
                    cardOnTop: game.game.openedCards.pop(),
                    previousDroppedCards: game.game.previousDroppedCards,
                    previousDroppedPlayer: game.game.previousDroppedPlayer,
                    action: game.game.lastPlayedAction
                }
                client.emit('currentCards', data)
                
                data = {
                    currentPlayer: game.game.currentPlayer,
                    playerCards: game.gameMember.currentCards
                }
                client.emit('currentPlayer', data)
            }
        })
    
        //Whenever someone disconnects this piece of code executed
        client.on('disconnect', function () {
            console.log('A user disconnected');
        });
    });
}

export default socketListener;