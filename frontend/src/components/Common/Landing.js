import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Offline } from "react-detect-offline";
import Socket from '../../APIs/index';
import './style.css';

class Landing extends Component {

	constructor() {
		super();
		this.state = {
			isConnectedToServer: true
		}
	}

	componentDidMount() {
		setInterval(() => {
			console.log(Socket.connected) 
			this.setState({
				isConnectedToServer: Socket.connected
			})
		}, 1000);
	}

	refreshPage = () => {
		window.location.reload()
	}

	render() {
		if (this.props.location.pathname === '/') {
			return (<Redirect to="/login" />);
		}
		return (
			<div>
				<div className="bg-danger text-center text-white">
					<Offline>You are offline!</Offline>
				</div>
				{
					this.state.isConnectedToServer === false ?

						<div className="bg-danger text-center text-white">
							Please refresh the page. <u onClick={this.refreshPage} className="showPointer">Click here</u>
						</div> :
						null
				}
			</div>
		);
	}

}
//export Landing Component
export default Landing;