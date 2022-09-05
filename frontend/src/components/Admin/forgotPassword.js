import React, { Component } from 'react';
import { Redirect } from 'react-router';

class ReportIssue extends Component {

    render() {

		if (localStorage.getItem('GameUserId')) {
			return (<Redirect to={`/`} />)
		}

        return (
            <div className="row m-5 p-5">
                <p className="display-4">
                    Please write an email 
                    to <span className="font-italic text-primary">jayasurya.pinaki@sjsu.edu</span> with
                    your <span className="font-weight-bold">username</span> requesting for change of password.
                </p>
                <a href="/"><button className="btn btn-primary p-3 m-3">Go back</button></a>
            </div>
        )
    }
}
//export ReportIssue Component
export default ReportIssue;