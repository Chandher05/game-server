import React, { Component } from 'react';
import axios from 'axios';

class UpdatePassword extends Component {

    constructor() {
        super()
        this.state = {
            isFetched: false,
            allUsers: [],
            userName: null,
            userId: null,
            password: null,
            errMsg: null,
            successMsg: null
        }
    }

    componentDidMount() {
        axios.get('/users/allUsers')
        .then((response) => {
            if (response.status === 200) {
                this.setState({
                    allUsers: response.data
                })
            }
            this.setState({
                isFetched: true
            })
        })
        .catch(() => {
            this.setState({
                isFetched: true
            })
        })
    }

    updatePassword = () => {
        if (this.state.password === "/admin-password-update") {
            let data = {
                userId: this.state.userId
            }
            axios.post('/users/enableUpdatePassword', data)
            .then(() => {
                this.setState({
                    errMsg: "",
                    successMsg: "Success"
                })
            })
            .catch(() => {
                this.setState({
                    errMsg: "Error",
                    successMsg: ""
                })
            })
        } else {
            this.setState({
                errMsg: "Invalid password",
                successMsg: ""
            })
        }
    }

    updateUserId = (e) => {
        this.setState({
            userId: e.target.value
        })
    }

    adminPassword = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    render() {

        if (!this.state.isFetched) {
            return (
                <div className="text-center p-5">
                    <h2><img src="/loading.gif" style={{ width: 50 + "px" }} alt="loading" className="m-4" />Fetching data...</h2>
                </div>
            )
        }

        if (this.state.allUsers.length === 0) {
            return (
                <div className="text-center p-5">
                    <h2>No users to display</h2>
                </div>
            )
        }

        var displayUsers = []
        for (var user of this.state.allUsers) {
            displayUsers.push(
                <div className="row">
                    <div className="col-md-4">{user.userId}</div>
                    <div className="col-md-8">{user.userName}</div>
                </div>
            )
        }
        return (
            <div className="row p-5 m-5">
                <div className="col-md-4 text-center">
                    <input className="form-control" type="text" value={this.state.userId} placeholder="User Id" onChange={this.updateUserId} />
                    <input className="form-control" type="text" value={this.state.password} placeholder="Admin Password" onChange={this.adminPassword} />
                    <button className="btn btn-success" onClick={this.updatePassword}>Create new password</button>
                    <p className="text-center text-danger">{this.state.errMsg}</p>
                    <p className="text-center text-success">{this.state.successMsg}</p>
                </div>
                <div className="col-md-8">
                    <div className="row">
                        <div className="col-md-4">User ID</div>
                        <div className="col-md-8">User Name</div>
                    </div>
                    {displayUsers}
                </div>
            </div>
        )
    }
}
//export UpdatePassword Component
export default UpdatePassword;