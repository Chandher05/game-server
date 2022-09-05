import Game from '../models/mongoDB/game'
import GameMember from '../models/mongoDB/gameMember'
import Users from '../models/mongoDB/users'
import mongoose from 'mongoose'


var UserListeners = (socket, allsockets, allUsers) => {


    socket.on('authenticatedListenerTemplate', async (authId) => {
        const userUID = socket.handshake.userUID
        if (userUID) {
            console.log("Valid auth id - authenticatedListener " + userUID)
        } else {
            console.log("Invalid auth: authenticatedListener")
            socket.disconnect(true)
        }
    })


    // Login
    socket.on('login', async (authId, params) => {
        try {
            const userUID = socket.handshake.userUID
            const email = socket.handshake.email
            const userName = socket.handshake.displayName
            if (userUID) {
                let userWithEmail = await Users.findOne({ email: email })
                // let userWithEmail = await Users.find()
                // console.log(userWithEmail)
                if (!userWithEmail) {
                    let userObj = {
                        userUID: userUID,
                        userName: userName,
                        email: email
                    }
                    let newUser = new Users(userObj)
                    let createdUser = await newUser.save()
                    allsockets[socket.id].setUid(userUID)
                    allsockets[socket.id].setUserId(createdUser._id)
                    allUsers[userUID] = createdUser._id
                    socket.emit('login-response', "USER_PROFILE_CREATED")
                    return
                } else if (userWithEmail.isActive) {
                    allsockets[socket.id].setUid(userUID)
                    allsockets[socket.id].setUserId(userWithEmail._id)
                    allUsers[userUID] = userWithEmail._id
                    socket.emit('login-response', "LOGIN_SUCCESS")
                    return
                } else {
                    socket.emit('login-response', "USER_NOT_ACTIVE")
                    return
                }
            } else {
                console.log("Invalid auth: login")
                socket.emit('login-response', "INVALID_AUTH_TOKEN")
                return
            }
        } catch (err) {
            socket.emit('login-response', "ERROR", err.message)
        }

    })


    // Register user whenever you have lost connection with backend
    socket.on('register-user', async (authId) => {
        try {
            const userUID = socket.handshake.userUID
            const email = socket.handshake.email
            if (userUID) {
                let userWithEmail = await Users.findOne({ email: email })
                // let userWithEmail = await Users.find()
                // console.log(userWithEmail)
                if (userWithEmail) {
                    allsockets[socket.id].setUid(userUID)
                    allsockets[socket.id].setUserId(userWithEmail._id)
                    allUsers[userUID] = userWithEmail._id
                } else {
                    socket.emit('global-user-status', "INVALID_AUTH_TOKEN")
                    socket.disconnect(true)
                }
            } else {
                socket.emit('global-user-status', "INVALID_AUTH_TOKEN")
                socket.disconnect(true)
            }
        } catch (err) {
            socket.emit('global-user-status', "ERROR", err.message)
        }

    })


    // Every user needs to have a gamer id. They cannot use the application until they have a gamer id
    // gsmerId in params
    socket.on('update-username', async (authId, params) => {
        try {
            const userUID = socket.handshake.userUID
            const email = socket.handshake.email
            if (userUID) {
                let userWithUserName = await Users.findOne({ userName: params.userName })
                if (userWithUserName) {
                    socket.emit('update-username-response', "USERNAME_ALREADY_EXISTS")
                    return
                }

                let userWithEmail = await Users.findOne({ email: email })
                if (userWithEmail) {
                    await Users.findOneAndUpdate(
                        {
                            userUID: userUID
                        },
                        {
                            gamerId: params.gamerId
                        })
                        socket.emit('update-username-response', "USERNAME_UPDATED")
                    return
                } else {
                    socket.emit('update-gamer-id-response', "INVALID_AUTH_TOKEN")
                    return
                }
            } else {
                console.log("Invalid auth: update-gamer-id")
                socket.emit('update-username-response', "INVALID_AUTH_TOKEN")
            }
        } catch (err) {
            console.log("ERROR")
            socket.emit('update-username-response', "ERROR", err.message)
        }
    })


    // Claim old username and merge all stats
    // oldGamerId in params. Current username will be lost from the system
    socket.on('claim-username', async (authId, params) => {
        try {
            const userUID = socket.handshake.userUID
            const email = socket.handshake.email
            const userName= socket.handshake.displayName
            const newUserName = params.newUserName
            const oldUserName = params.oldUserName
            if (userUID) {
                let oldUserNameObj = await Users.findOne({ userName: oldUserName })
                if (oldUserNameObj && oldUserNameObj.email) {
                    socket.emit('claim-username-response', "CANNOT_CLAIM_USERNAME")
                    return
                }
                let newUserNameObj = await Users.findOne({ userName: newUserName })
                
                if (oldUserNameObj && newUserNameObj) {
                    let randomUserName = Math.random().toString(36).substring(2,)
                    randomUserName = oldGamerId + "___" + randomUserName
                    randomUserName = randomUserName.substring(0, 50)

                    await Users.findOneAndUpdate(
                        {
                            userName: oldUserName
                        },
                        {
                            userName: randomUserName,
                            isActive: false
                        }
                    )

                    await Users.findOneAndUpdate(
                        {
                            userName: newUserName
                        },
                        {
                            userName: oldUserName,
                            $inc: {
                                totalGames: oldUserNameObj.totalGames,
                                totalWins: oldUserNameObj.totalWins,
                                totalDeclares: oldUserNameObj.totalDeclares,
                                totalFifties: oldUserNameObj.totalFifties,
                                totalFifties: oldUserNameObj.totalFifties
                            }
                        }
                    )

                    socket.emit('claim-username-response', "USERNAME_CLAIMED")
                } else {
                    socket.emit('claim-username-response', "INVALID_USERNAMES")
                }
            } else {
                console.log("Invalid auth: claim-gamer-id")
                socket.emit('claim-username-response', "INVALID_AUTH_TOKEN")
            }
        } catch (err) {
            console.log("ERROR")
            socket.emit('claim-username-response', "ERROR", err.message)
        }
    })


    // Get stats of a particular user using their user id
    // userId in params
    socket.on('get-stats', async (authId, params) => {
        try {
            const userUID = socket.handshake.userUID
            const email = socket.handshake.email
            if (userUID) {
                let user = await Users.findById(
                    mongoose.Types.ObjectId(params.mongoId)
                )
        
                if (!user) {
                    socket.emit('get-stats-response', "INVALID_MONGO_ID")
                }
        
                const returnValue = {
                    userName: user.userName,
                    gamesCount: user.totalGames,
                    totalWins: user.totalWins,
                    totalDeclares: user.totalDeclares,
                    totalFifties: user.totalFifties,
                    totalPairs: user.totalPairs,
                }

                socket.emit('get-stats-response', "SUCCESS", returnValue)
            } else {
                console.log("Invalid auth: get-stats")
                socket.disconnect(true)
            }
        } catch (err) {
            console.log("ERROR")
            socket.emit('get-stats-response', "ERROR", err.message)
        }
    })


    // Get leaderboard of all users in the system
    // No params needed
    socket.on('get-leaderboard', async (authId, params) => {
        try {
            const userUID = socket.handshake.userUID
            const email = socket.handshake.email
            if (userUID) {

                let allUsers = await Users.find(),
                user,
                userId,
                returnValue = []
    
    
                for (user of allUsers) {
                    userId = user._id
        
                    // let ratio = 0
                    // if (user.totalGames > 0) {
                    //     ratio = user.totalDeclares / user.totalGames
                    // }
                    // ratio = ratio.toFixed(2)
                    
                    returnValue.push({
                        userId: userId,
                        userUID: user.userUID,
                        userName: user.userName,
                        gamesCount: user.totalGames,
                        totalWins: user.totalWins,
                        totalDeclares: user.totalDeclares,
                        totalFifties: user.totalFifties,
                        totalPairs: user.totalPairs,
                    })
                }

                socket.emit('get-leaderboard-response', "SUCCESS", returnValue)
            } else {
                console.log("Invalid auth: claim-username")
                socket.disconnect(true)
            }
        } catch (err) {
            console.log("ERROR")
            socket.emit('get-leaderboard-response', "ERROR", err.message)
        }
    })

}

export default UserListeners