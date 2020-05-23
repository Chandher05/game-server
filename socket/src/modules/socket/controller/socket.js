import constants from '../../../utils/constants';
/**
 * Connect to client.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.socketRoot = async (req, res) => {
    
	try {

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send("Connected")
	} catch (error) {
		console.log(`Error while connecting to server ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}