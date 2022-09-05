import startGame from './startGame'
import UserData from '../../utils/userDataClass'
import UserListeners from './userListeners'
import GameListeners from './gameListeners'
import GamePlayListeners from './gamePlayListeners'
import Users from '../models/mongoDB/users'

let allsockets = {}
let allUsers = {}


// var sendData = async (socket, gameId, userId, gameData, membersData) => {

//     // console.log("SENDING", Date.now())
    
//     let data = await startGame.getGameStatus(gameId, userId, gameData, membersData)
//     if (data) { 
//         let currentCards = {
//             cardOnTop: data.game.openedCards.pop(),
//             previousDroppedCard: data.game.previousDroppedCards,
//             previousDroppedPlayer: data.game.previousDroppedPlayer,
//             action: data.game.lastPlayedAction
//         }

//         let allPlayers = {
//             currentPlayer: data.game.currentPlayer,
//             cardsCount: data.allCards,
//             hostPlayer: data.game.createdUser,
//             isRoundComplete: data.game.isRoundComplete,
//             isRoundComplete: data.game.isRoundComplete,
//             isEnded: data.game.isEnded,
//             action: data.game.lastPlayedAction
//         }

//         let returnValue = {
//             currentCards: currentCards,
//             scores: data.allScores,
//             allPlayers: allPlayers,
//             roundStatus: data.roundStatus
//         }
//         socket.emit('commonGameData', returnValue)

//         if (data.gameMember) {
            
//             let currentPlayerData = {
//                 currentPlayer: data.game.currentPlayer,
//                 playerCards: data.gameMember.currentCards,
//                 isRoundComplete: data.game.isRoundComplete,
//                 isGameComplete: data.game.isEnded,
//                 hostPlayer: data.game.createdUser,
//                 isWaiting: data.waitingPlayers
//             }

//             socket.emit('currentPlayer', currentPlayerData)
//         } else if (data.game.waiting.includes(userId)) {
            
//             let currentPlayerData = {
//                 currentPlayer: null,
//                 playerCards: [],
//                 isRoundComplete: data.game.isRoundComplete,
//                 isGameComplete: data.game.isEnded,
//                 hostPlayer: data.game.createdUser,
//                 isWaiting: true
//             }

//             socket.emit('currentPlayer', currentPlayerData)
//         } else if (data.game.spectators.includes(userId)) {
            
//             let currentPlayerData = {
//                 currentPlayer: null,
//                 playerCards: [],
//                 isRoundComplete: data.game.isRoundComplete,
//                 isGameComplete: data.game.isEnded,
//                 hostPlayer: data.game.createdUser,
//                 isWaiting: false
//             }

//             socket.emit('currentPlayer', currentPlayerData)
//         }

//     } 
// }

// var sendWaitingScreenData = async (gameId) => {
//     let users = await startGame.getPlayersInGame(gameId)
//     let allUsers = users.players.concat(users.spectators)
//     for (var player of allUsers) {
//         if (player && allsockets[player._id]) {
//             allsockets[player._id].emit('playersInGame', users)
//         }
//     }
// }

const admin = require('firebase-admin')
var serviceAccount = require("../../serviceAccountKey.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});


var socketListener = (io) => {

    // io middleware
    io.use(async (socket, next) => {
        if ("sysid" in socket.handshake.headers) {
            allsockets[socket.id] = new UserData(socket, socket.handshake.headers.sysid);
            console.log("User connected");
            console.table(allsockets);
            let allUsersObj = await Users.find()
            for (var user of allUsersObj) {
                if (user.userUID) {
                    allUsers[user.userUID] = user._id
                }
            }
            next()
        } else {
            next(new Error("Thou shall not pass without sysid"));
        }

    });


    //Whenever someone connects this gets executed
    io.on('connection', async (socket) => {


        // Socket middleware. Gets uid from firebase
        socket.use(async ([event, ...args], next) => {
            try {
                let authToken = args[0]
                let decodedToken = await admin.auth().verifyIdToken(authToken)
                const uid = decodedToken.uid;
                let userRecord = await admin.auth().getUser(uid)
                socket.handshake.userUID = uid
                socket.handshake.email = userRecord.email
                socket.handshake.displayName = userRecord.displayName
            } catch (err) {
                socket.handshake.userUID = socket.handshake.headers.useruid
                socket.handshake.email = socket.handshake.headers.email
                socket.handshake.displayName = socket.handshake.headers.displayname
            }
            next()
        })
        
        UserListeners(socket, allsockets, allUsers)
        GameListeners(socket, allsockets, allUsers)
        GamePlayListeners(socket, allsockets, allUsers)
        
        //Whenever someone disconnects this piece of code executed
        socket.on('disconnect', async () => {
            delete allsockets[socket.id]
            console.log('A user disconnected', socket.id);
            console.table(allsockets)
        });
    });


    // var count = 0
    // setInterval( async () => {

    //     var allGames = await startGame.activeGames()

    //     if (allGames.length === 0) {
    //         // socket.emit('currentPlayer', currentPlayerData)
    //         console.table(socketIDS)
    //         var socket1 = allsockets["abcdef"]
    //         try {
    //             socket1.emit("test", {"asdasD": 100})

    //         } catch (err) {

    //         }
    //         console.log("No active games")
    //     }        

    //     for (var gameData of allGames) {

    //         var gameId = gameData.gameId

    //         var allPlayers = await startGame.playersInGame(gameData)
            
    //         let allGameMembers = await GameMember.find({
    //             gameId: gameId
    //         })

    //         let waitingPlayers = []
    //         for (var waitingPlayer of gameData.waiting) {
    //             let playerDetails = await Users.findById(waitingPlayer)
    //             waitingPlayers.push(playerDetails.userName)
    //         }
            
    //         var count = 0;
    //         for (var userId of allPlayers) {
    //             if (allsockets[userId]) {
    //                 count++;
    //                 sendData(allsockets[userId], gameId, userId, gameData, allGameMembers, waitingPlayers)
    //             }
    //         }
            
    //         if (count == 0) {
    //             console.log("No users connected to game " + gameId)
    //         } else {
    //             console.log("Pushed data from server to " + count + " player(s) of game " + gameId)
    //         }

    //     }

    //     var notStartedGames = await startGame.notStartedGames()
    //     for (var game of notStartedGames) {
    //         var timeDiff = Date.now() - game.createdAt
    //         if (timeDiff > 2000000 || !game.createdAt) {
    //             console.log("Ending game " + game.gameId)
    //             await startGame.endGame(game.gameId)
    //         } else {
    //             console.log("Game not started " + game.gameId)
    //             await sendWaitingScreenData(game.gameId)
    //         }
    //     }

    // }, 10 * 1000)

}

export default socketListener;