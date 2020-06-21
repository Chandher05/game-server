import startGame from './startGame'

let allUsers = {}
let allClients = {}
let clientIDS = {}
let userIDS = {}

var sendData = async (client, gameId, userId) => {

    console.log("SENDING", Date.now())
    
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
            allPlayers: allPlayers,
            roundStatus: data.roundStatus
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
}


var socketListener = (io) => {
    //Whenever someone connects this gets executed
    io.on('connection', function (client) {
        console.log('A user connected', client.id);

        // allUsers[client.id] = client
        
        try {
            client.on('getPlayers', async (gameId) => {
                let users = await startGame.getPlayersInGame(gameId)
                client.emit('playersInGame', users)
            })
        } catch (error) {
            
        }
        
        try {
            client.on('getGameStatus', async (gameId, userId) => {

                if (!allUsers[gameId]) {
                    allUsers[gameId] = new Set([userId])
                } else {
                    allUsers[gameId].add(userId)
                }
                allClients[userId] = client
                clientIDS[client.id] = userId
                userIDS[userId] = gameId

                sendData(client, gameId, userId) 
            })
        } catch (error) {

        }

        client.on('pushCommonData', async (gameId, userId) => {
            
            if (!allUsers[gameId]) {
                allUsers[gameId] = new Set([userId])
            } else {
                allUsers[gameId].add(userId)
            }
            allClients[userId] = client
            clientIDS[client.id] = userId
            userIDS[userId] = gameId
            
            if (allUsers[gameId]) {
                console.log(allUsers[gameId].size)
                for (var userId of allUsers[gameId]) {
                    sendData(allClients[userId], gameId, userId)
                }
            }

        });

        //Whenever someone disconnects this piece of code executed
        client.on('disconnect', function () {
            let userId = clientIDS[client.id]
            let gameId = userIDS[userId]
            delete allClients[userId]
            if (allUsers[gameId]) {
                allUsers[gameId].delete(userId)
                if (allUsers[gameId].size === 0) {
                    delete allUsers[gameId]
                }
            }
            console.log('A user disconnected', client.id);
        });
    });
}

export default socketListener;