`use strict`

import mongoose from 'mongoose'

const Messages = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    createdAt : {
        type : Date,
        default : Date.now,
    },
    subject : {
        type : String,
        required: true
    },
    body : {
        type : String,
        required: true
    }
}, { versionKey: false })

export default mongoose.model('Messages', Messages)
