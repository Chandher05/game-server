`use strict`

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const Users = new mongoose.Schema({
	userName: {
		type: String,
		maxlength: 50,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	isActive: {
		type: Boolean,
		default: true
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

Users.pre('save', function preSave(next) {
	try {
		const user = this
		if (!user.isModified('password')) {
			return next()
		}
		let salt = bcrypt.genSaltSync(10)
		var hash = bcrypt.hashSync(user.password, salt)
		user.password = hash
		next(null)
	} catch (error) {
		next(error)
	}
})

Users.methods.validatePassword = function validatePassword(password) {
	const user = this
	return new Promise((resolve) => {
		try {
			let isMatch = bcrypt.compareSync(password, user.password)
			resolve(isMatch)
		} catch (error) {
			resolve(false)
		}
	})
}

export default mongoose.model('users', Users)
