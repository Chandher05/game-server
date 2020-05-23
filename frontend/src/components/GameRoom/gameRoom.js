import React, { Component } from 'react';
import getValue from '../../APIs/getMessage'

class GameRoom extends Component {

	constructor() {
		super() 
		this.state = {
			message: ''
		}
	}

	componentDidMount () {
		getValue((err, message) => {
			this.setState({
				message: message
			})
		})
	}

	render() {

		return (
			<p>{this.state.message}</p>
		);
	}

}
//export GameRoom Component
export default GameRoom;