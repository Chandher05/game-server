import React, { Component } from 'react';
import { Redirect } from 'react-router';
import getValue from '../../APIs/getMessage'

class Landing extends Component {

	constructor() {
		super() 
		this.state = {
			message: ''
		}
	}

	// render() {
	// 	if (this.props.location.pathname === '/') {
	// 		return (<Redirect to="/login" />);
	// 	}
	// 	return (null);
	// }

	componentDidMount () {
		getValue((err, message) => {
			this.setState({
				message: message
			})
			console.log("HERE")
		})
		console.log("AJSDas")
	}

	render() {

		return (
			<p>{this.state.message}</p>
		);
	}

}
//export Landing Component
export default Landing;