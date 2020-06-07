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
                    <button className="btn btn-danger w-100" onClick={this.logout}><i class="fas fa-sign-out-alt"></i> Logout</button>
                </div>
                <div className="pt-3">
                    <a href="/rules" target="_blank">
                        <button className="btn btn-dark w-100"><i class="fas fa-book-reader"></i> View Rules</button>
                    </a>
                </div>
                <div className="pt-3">
                    <button className="btn btn-secondary w-100" data-toggle="modal" data-target="#updateAccoutnModal"><i class="fas fa-cogs"></i> Update Account</button>
                </div>
                <div className="pt-3">
                    <a href="/report" target="_blank">
                        <button className="btn btn-warning w-100"><i class="fas fa-comment-alt"></i> Report bug</button>
                    </a>
                </div>
                <div className="pt-3">
                    <a href="/stats">
                        <button className="btn btn-info w-100"><i class="fas fa-crown"></i> View stats</button>
                    </a>
                </div>


                <div class="modal fade" id="updateAccoutnModal" tabindex="-1" role="dialog" aria-labelledby="updateAccoutnModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-body border">
                                <div className="form-group">
                                    <label for="userName">Username <span className="text-danger">*</span></label>
                                    <input className="form-control" id="userName" value={this.state.userName} onChange={this.userNameChangeHandler} placeholder="User name"></input>
                                </div>
								<div className="row p-2">
									<div className="col-md-4">
										<button type="button" class="btn btn-secondary w-100" data-dismiss="modal" onClick={this.resetUpdateAccountDetails}>Close</button>
									</div>								
									<div className="col-md-4 offset-md-4">
										<button type="button" class="btn btn-primary w-100" onClick={this.updateUserDetails}>Save changes</button>
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