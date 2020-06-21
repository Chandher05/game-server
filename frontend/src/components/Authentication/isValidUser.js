import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';

class IsValidUser extends Component {


    constructor() {
        super()
        this.state = {
            redirect: null
        }
    }

    componentDidMount() {
        axios.get(`/users/profile/${localStorage.getItem('GameUserId')}`)
        .then((response) => {
            if (response.status === 204) {
                localStorage.removeItem('GameUserId')
                localStorage.removeItem('GameUsername')
                this.setState({
                    redirect: <Redirect to="/" />
                })
            }
        })
        .catch(() => {
            localStorage.removeItem('GameUserId')
            localStorage.removeItem('GameUsername')
            this.setState({
                redirect:  <Redirect to="/" />
            })
        })
    }

    render() {

        if (this.state.redirect === null) {
            return (null)
        }

        return(this.state.redirect)
    }
}

//export IsValidUser Component
export default IsValidUser;