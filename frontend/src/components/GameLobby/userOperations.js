import React, { Component } from 'react';
import axios from 'axios';

class UserOperations extends Component {

    constructor() {
        super()
        this.state = {
            userName: localStorage.getItem('GameUsername'),
			updateUserError: null,
			updateUserSuccess: null
        }
    }

    logout = () => {
		localStorage.removeItem('GameUserId')
		localStorage.removeItem('GameUsername')
		window.location.reload()
	}

	resetUpdateAccountDetails = () => {
		this.setState({
			userName: localStorage.getItem('GameUsername'),
			updateUserSuccess: null,
			updateUserError: null
		})
	}

	userNameChangeHandler = (e) => {
		var length = e.target.value.length
		if (length > 0 && e.target.value[length - 1] !== " ") {
			this.setState({
				userName: e.target.value
			})
		} else if (length === 0) {
			this.setState({
				userName: e.target.value
			})
		}
	}

	updateUserDetails = () => {
		this.setState({
			updateUserError: null,
			updateUserSuccess: null
		})
		if (this.state.userName.length === 0) {
			this.setState({
				updateUserError: "Username cannot be empty",
				updateUserSuccess: null
			})
			return
		}
		const userDetails = {
			userName: this.state.userName,
			userId: localStorage.getItem('GameUserId')
		}
		axios.put(`/users/update`, userDetails)
		.then(() => {
			this.setState({
				updateUserError: null,
				updateUserSuccess: "Updated!"
			})
			localStorage.setItem('GameUsername', this.state.userName)
		})
		.catch(() => {
			this.setState({
				updateUserError: "Username is already taken",
				updateUserSuccess: null
			})
		})
	}

    render() {

        return (
            <div>
                <div>
                    <button className="btn btn-danger w-100" onClick={this.logout}><i className="fas fa-sign-out-alt"></i> Logout</button>
                </div>
                <div className="pt-3">
                    <a href="/rules" target="_blank">
                        <button className="btn btn-dark w-100"><i className="fas fa-book-reader"></i> View Rules</button>
                    </a>
                </div>
                <div className="pt-3">
                    <button className="btn btn-secondary w-100" data-toggle="modal" data-target="#updateAccoutnModal"><i className="fas fa-cogs"></i> Update Account</button>
                </div>
                {/* <div className="pt-3">
                    <a href="/report">
                        <button className="btn btn-warning w-100"><i className="fas fa-comment-alt"></i> Give Feedback</button>
                    </a>
                </div> */}
                <div className="pt-3">
                    <a href="/hall-of-fame">
                        <button className="btn btn-warning w-100"><i className="fas fa-crown"></i> Hall of fame</button>
                    </a>
                </div>
                <div className="pt-3">
                    <a href="/leaderboard">
                        <button className="btn btn-info w-100"><i className="fas fa-trophy"></i> Leaderboard</button>
                    </a>
                </div>
                <div className="pt-3 text-center">
					<img src="/rcb.svg" alt="rcb" />
                </div>
                <div className="pt-3 text-center">
					<a href="/declare.apk" download>
						<p>Download APK for Andriod</p>
					</a>
                </div>


                <div className="modal fade" id="updateAccoutnModal" tabIndex="-1" role="dialog" aria-labelledby="updateAccoutnModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body border">
                                <div className="form-group">
                                    <label htmlFor="userName">Username <span className="text-danger">*</span></label>
                                    <input className="form-control" id="userName" value={this.state.userName} onChange={this.userNameChangeHandler} placeholder="User name"></input>
                                </div>
								<div>
									<p>Please write an email to <span className="font-italic text-primary">jayasurya1796@gmail.com</span> with your <span className="font-weight-bold">username</span> if you wish to change your password</p>
								</div>
								<div className="row p-2">
									<div className="col-md-4">
										<button type="button" className="btn btn-secondary w-100" data-dismiss="modal" onClick={this.resetUpdateAccountDetails}>Close</button>
									</div>								
									<div className="col-md-4 offset-md-4">
										<button type="button" className="btn btn-primary w-100" onClick={this.updateUserDetails}>Save changes</button>
									</div>
								</div>
								{
									this.state.updateUserError !== null?
									<p className="text-danger text-center">{this.state.updateUserError}</p>:
									this.state.updateUserSuccess !== null?
									<p className="text-success text-center">{this.state.updateUserSuccess}</p>:
									<p>{null}</p>
								}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
//export UserOperations Component
export default UserOperations;