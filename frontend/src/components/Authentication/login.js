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
        this.setState({
            userName: e.target.value
        })
    }

    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    submitLogin = (e) => {
        var userData = {
            userName: this.state.userName,
            password: this.state.password,
        }
        axios.post("/users/login", userData)
            .then((response) => {
                localStorage.setItem('GameUsername', response.data.userName);
                localStorage.setItem('GameUserId', response.data._id);
                this.setState({
                    userName: '',
                    password: '',
                })
            })
            .catch(() => {
                this.setState({
                    errMsg: 'Failed to login',
                    successMsg: '',
                });
            })
    }

    render() {
        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('redirect');
        if (localStorage.getItem('GameUserId') && myParam) {
            return (<Redirect to={`${myParam}`} />)
        } else if (localStorage.getItem('GameUserId')) {
            return (<Redirect to={`/joinGame`} />)
        }

        return (
            <div className="p-5 ">

                <div className="row pt-5 mb-5">
                    <div className="col-md-4 offset-md-4 p-5 shadow">
                        <h5 className="text-center font-weight-bolder">Login</h5>
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
                                <input type="submit" id="userLogin" onClick={this.submitLogin} className="form-control bg-primary text-white" value="Login" />
                            </div>
                            <div className="panel text-center">
                                <p className="font-italic"><Link to={`/forgot-password`}>Forgot password?</Link></p>
                                <p>or</p>
                                <p><Link to={`/create-account?redirect=${encodeURIComponent(myParam)}`}>Create account</Link></p>
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