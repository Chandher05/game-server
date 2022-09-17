`use strict`

module.exports = {
	session: process.env.SESSION,
	token: process.env.TOKEN,
	database: {
		mongoDbUrl: process.env.MONGODB_URL,
		name: process.env.DATABASE,
		user: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		host: process.env.DB_HOST,
		port: process.env.DB_DBPORT,
		dialect: process.env.DB_DIALECT,
	},
	nodemailer: {
		EMAIL_ID: process.env.EMAIL_ID,
		APP_PASSWORD: process.env.APP_PASSWORD
	},
	frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000", // For now no use of frontend urls in backend, when security is tighetened, add expected urls to cors.
}
