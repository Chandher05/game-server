import Users from '../models/mongoDB/users'
import { sysidConnected, userid_useruid, useruid_sysid, useruid_userid } from '../../utils/trackConnections'



var ConnectionListeners = (socket) => {

    // Middleware to store user connection details
    socket.use(async ([event, ...args], next) => {
        const userUID = socket.handshake.userUID
        const email = socket.handshake.email
        let userId
        try {
            if (userUID in useruid_userid) {
                userId = useruid_userid[userUID]
            } else {
                let userWithEmail = await Users.findOne({ userUID: userUID })
                userId = userWithEmail._id.toString()
                useruid_userid[userUID] = userId
                userid_useruid[userId] = userUID
                useruid_sysid[userUID] = new Set()
            }
            useruid_sysid[userUID].add(socket.handshake.headers.sysid)
            sysidConnected[socket.handshake.headers.sysid]["userUID"] = userUID
            console.table(sysidConnected)
            console.log("User emited to server " + userId)
            next()
        } catch (err) {
            socket.disconnect(true)
        }
    })

    socket.on('logout', async (authToken) => {
        const userUID = socket.handshake.userUID
        const email = socket.handshake.email
        delete sysidConnected[socket.handshake.headers.sysid]
        if (userUID in useruid_sysid) {
            useruid_sysid[userUID].delete(socket.handshake.headers.sysid)
        }
    })

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', async () => {
    
        let userUID = sysidConnected[socket.handshake.headers.sysid]["userUID"]
        delete sysidConnected[socket.handshake.headers.sysid]
        if (userUID in useruid_sysid) {
            useruid_sysid[userUID].delete(socket.handshake.headers.sysid)
        }
        console.table(sysidConnected)
    });

}

export default ConnectionListeners