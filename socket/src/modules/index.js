import startGame from './startGame'

var socketListener = (io) => {
    //Whenever someone connects this gets executed
    io.on('connection', function (client) {
        console.log('A user connected');
    
        client.on('getValue', (interval) => {
            console.log('client is subscribing to timer with interval ', interval);
            client.emit('result', "Connected")
        });
    
        client.on('getPlayers', async (gameId) => {
            let users = await startGame.getPlayersInGame(gameId)
            client.emit('playersInGame', users)
        })
    
        //Whenever someone disconnects this piece of code executed
        client.on('disconnect', function () {
            console.log('A user disconnected');
        });
    });
}

export default socketListener;