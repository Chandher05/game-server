`use strict`

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const Users = new mongoose.Schema({
	username: {
		type: String,
		maxlength: 50,
		required: true,
	},
	password: {
		type: String,
		required: true,
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
