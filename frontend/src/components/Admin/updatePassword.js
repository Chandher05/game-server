import React, { Component } from 'react';
import axios from 'axios';

class UpdatePassword extends Component {

    constructor() {
        super()
        this.state = {
            isFetched: false,
            isActive: false,
            userName: null,
            password1: null,
            password2: null,
            realUsername: null,
            successMsg: null,
            errMsg: null
        }
    }

    componentDidMount() {
        let data = {
            userId: this.props.match.params.userId
        }
        axios.post('/users/isUpdatePasswordActive', data)
        .then((response) => {
            console.log(response.data.userName)
            if (response.status === 200) {
                this.setState({
                    realUsername: response.data.userName,
                    isActive: true
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

    updateUsername = (e) => {
        this.setState({
            userName: e.target.value
        })
    }

    newPassword1 = (e) => {
        this.setState({
            password1: e.target.value
        })
    }

    newPassword2 = (e) => {
        this.setState({
            password2: e.target.value
        })
    }

    updatePassword = () => {
        console.log(this.state.userName)
        console.log(this.state.realUsername)
        console.log(this.state.password1)
        console.log(this.state.password2)
        var pattern = /^[ ]*$/
        if (this.state.userName !== this.state.realUsername) {
            this.setState({
                errMsg: "Invalid username",
                successMsg: ""
            })
        } else if (this.state.password1 !== this.state.password2) {
            this.setState({
                errMsg: "Passwords do not match",
                successMsg: ""
            })    
        } else if (this.state.password1.match(pattern)) {
            this.setState({
                errMsg: "Password cannot be empty",
                successMsg: ""
            })    
        } else {
            let data = {
                userId: this.props.match.params.userId,
                password: this.state.password1
            }
            axios.post('/users/updatePassword', data)
            .then(() => {
                this.setState({
                    errMsg: "",
                    successMsg: "Success"
                }) 
            }) 
            .catch(() => {
                this.setState({
                    errMsg: "Password could not be reset",
                    successMsg: ""
                }) 
            })
        }
    }

    render() {

        if (!this.state.isFetched) {
            return (
                <div className="text-center p-5">
                    <h2><img src="/loading.gif" style={{ width: 50 + "px" }} alt="loading" className="m-4" />Fetching data...</h2>
                </div>
            )
        }

        if (!this.state.isActive) {
            return (
                <div className="text-center p-5">
                    <h2>Invalid session. Please contact <span className="font-weight-light font-italic">jayasurya.pinaki@sjsu.edu</span> if this is a mistake.</h2>
                </div>
            )
        }

        return (
            <div className="row mt-5">
                <div className="col-md-4 offset-md-4 text-center">
                    <h4>Reset your password</h4>
                    <input className="form-control m-2" type="text" value={this.state.userName} placeholder="Username" onChange={this.updateUsername} />
                    <input className="form-control m-2" type="password" value={this.state.password1} placeholder="New password" onChange={this.newPassword1} />
                    <input className="form-control m-2" type="password" value={this.state.password2} placeholder="Re-enter password" onChange={this.newPassword2} />
                    <p className="text-center text-danger">{this.state.errMsg}</p>
                    <p className="text-center text-success">{this.state.successMsg}</p>
                    <button className="btn btn-success" onClick={this.updatePassword}>Update password</button>
                </div>
            </div>
        )
    }
}
//export UpdatePassword Component
export default UpdatePassword;