`use strict`

import mongoose from 'mongoose'

const UpdatePassword = new mongoose.Schema({
    userId: mongoose.Types.ObjectId,
    createdAt : {
        type : Date,
        default : Date.now,
    },
    isActive : {
        type : Boolean,
        default : true
    }
}, { versionKey: false })

export default mongoose.model('UpdatePassword', UpdatePassword)
