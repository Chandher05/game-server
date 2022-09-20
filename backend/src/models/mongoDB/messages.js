`use strict`

import mongoose from 'mongoose'

const Messages = new mongoose.Schema({
    userUID: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    subject: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    seen: {
        type: Boolean,
        required: true,
        default: false
    },
}, { versionKey: false })

export default mongoose.model('Messages', Messages)