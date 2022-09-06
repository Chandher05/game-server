`use strict`

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const Users = new mongoose.Schema({
	userUID: {
		type: String,
		required: true
	},
	userName: {
		type: String,
		maxlength: 50,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	isActive: {
		type: Boolean,
		default: true
	},
	totalGames: {
		type: Number,
		default: 0
	},
	totalWins: {
		type: Number,
		default: 0
	},
	totalDeclares: {
		type: Number,
		default: 0
	},
	totalFifties: {
		type: Number,
		default: 0
	},
	totalPairs: {
		type: Number,
		default: 0
	}
}, { versionKey: false })

export default mongoose.model('users', Users)
