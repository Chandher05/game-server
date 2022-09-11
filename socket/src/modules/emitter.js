import { sysidConnected, userid_useruid, useruid_sysid, useruid_userid } from '../../utils/trackConnections'

exports.emitToUserUID = (userUID, message, ...args) => {

    var sysIds = []
    if (userUID in useruid_sysid && useruid_sysid[userUID].size > 0) {
        sysIds = [...useruid_sysid[userUID]]
    }
    console.log(userUID, sysIds)
    let socket
    for (var sysId of sysIds) {
        socket = sysidConnected[sysId].socket
        socket.emit(message, ...args)
    }

}

exports.emitToUserId = (userId, message, ...args) => {

    let userUID = userid_useruid[userId]    
    var sysIds = []
    if (userUID in useruid_sysid && useruid_sysid[userUID].size > 0) {
        sysIds = [...useruid_sysid[userUID]]
    }
    let socket
    for (var sysId of sysIds) {
        socket = sysidConnected[sysId].socket
        socket.emit(message, ...args)
    }

}