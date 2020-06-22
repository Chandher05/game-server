import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Offline } from "react-detect-offline";

class Landing extends Component {

	render() {
		if (this.props.location.pathname === '/') {
			return (<Redirect to="/login" />);
		}
		return (
			<div className="bg-danger text-center text-white">
				<Offline>You are offline!</Offline>
			</div>
		);
	}

}
//export Landing Component
export default Landing;