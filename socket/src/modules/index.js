import startGame from './startGame'

var socketListener = (io) => {
    //Whenever someone connects this gets executed
    io.on('connection', function (client) {
        console.log('A user connected');
    
        client.on('getPlayers', async (gameId) => {
            let users = await startGame.getPlayersInGame(gameId)
            client.emit('playersInGame', users)
        })
        
        client.on('getGameStatus', async (gameId) => {
            let data,
                game = await startGame.getGameStatus(gameId)

            data = {
                cardOnTop: game.game.openedCards.pop(),
                previousDroppedCards: game.game.previousDroppedCards,
                previousDroppedPlayer: game.game.previousDroppedPlayer
            }
            client.emit('currentCards', data)
            
            data = {
                currentPlayer: game.game.currentPlayer
            }
            client.emit('currentPlayer', data)
        })
    
        //Whenever someone disconnects this piece of code executed
        client.on('disconnect', function () {
            console.log('A user disconnected');
        });
    });
}

export default socketListener;