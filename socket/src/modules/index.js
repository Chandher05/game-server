import Users from '../models/mongoDB/users'
import admin from 'firebase-admin'
import PlayerListeners from './playerListeners'
import ConnectionListeners from './connectionListeners'
import GameAdminListeners from './gameAdminListeners'
import { sysidConnected, userid_useruid, useruid_sysid, useruid_userid } from '../../utils/trackConnections'
var serviceAccount = require("../../serviceAccountKey.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});


var socketListener = (io) => {

    // io middleware
    io.use(async (socket, next) => {
        if ("sysid" in socket.handshake.headers) {
            sysidConnected[socket.handshake.headers.sysid] = {
                socket: socket,
                socketid: socket.id
            }
            console.log("User connected");
            console.table(sysidConnected);
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
                next()
            } catch (err) {
                console.log("Invalid AUTH_TOKEN")
            }
            
        })

        ConnectionListeners(socket)
        GameAdminListeners(socket)
        PlayerListeners(socket)

    });

}

export default socketListener;