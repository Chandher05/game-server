import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Redirect } from 'react-router';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
            errMsg: '',
            successMsg: ''
        }
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

    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    createAccount = (e) => {
        var userData = {
            userName: this.state.userName,
            password: this.state.password,
        }
        axios.post("/users/signup", userData)
            .then((response) => {
                localStorage.setItem('GameUsername', response.data.userName);
                localStorage.setItem('GameUserId', response.data._id);
                this.setState({
                    userName: '',
                    password: '',
                })
            })
            .catch((err) => {
                if (err.response) {
                    this.setState({
                        errMsg: err.response.data,
                        successMsg: '',
                    });
                }
                this.setState({
                    errMsg: 'Failed to create account',
                    successMsg: '',
                });
            })
    }

    render() {
        if (localStorage.getItem('GameUserId')) {
            return (<Redirect to={`/joinGame${this.props.location.search}`} />)
        }

        return (
            <div className="p-5 ">

                <div className="row pt-5 mb-5">
                    <div className="col-md-4 offset-md-4 p-5 shadow">
                        <h5 className="text-center font-weight-bolder">Create Account</h5>
                        <div className="mt-3">
                            <div className="form-group">
                                <label htmlFor="userName">User Name</label>
                                <input type="text" id="userName" onChange={this.userNameChangeHandler} value={this.state.userName} className="form-control" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="userPassword">Password</label>
                                <input type="password" id="userPassword" onChange={this.passwordChangeHandler} value={this.state.password} className="form-control" required />
                            </div>
                            <div className="text-center">
                                <p className="text-danger">
                                    {' '}
                                    {this.state.errMsg}
                                    {' '}
                                </p>
                            </div>
                            <div className="form-group">
                                <input type="submit" onClick={this.createAccount} className="form-control bg-primary text-white" value="Create Account" />
                            </div>
                                <div className="panel text-center">
                                    <p>or</p>
                                    <p>Already have an account? <Link to={`/login${this.props.location.search}`}>Sign in</Link></p>
                                </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
//export Home Component
export default Home;