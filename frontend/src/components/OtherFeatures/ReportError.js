import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Input, FormText } from 'reactstrap';
import axios from 'axios';

class ReportIssue extends Component {

    constructor() {
        super()
        this.state = {
            email: '',
            description: '',
            warningMsg: '',
            selectedFile: [],
            filename: null
        }
    }

    isValidEmail = () => {
        if (this.state.email.match(/^.+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/) === null) {
            return false
        }
        return true
    }

	emailChangeHandler = (e) => {
		var length = e.target.value.length
		if (length > 0 && e.target.value[length - 1] !== " ") {
			this.setState({
				email: e.target.value
			})
		} else if (length === 0) {
			this.setState({
				email: e.target.value
			})
		}
    }
    
    descriptionChangeHandler = (e) => {
        this.setState({
            description: e.target.value
        })
    }

    onChangeFileUpload = (e) => {
        var allFiles = []
        for (var file of e.target.files) {
            allFiles.push(file)
        }
        this.setState({
            selectedFile: allFiles,
            filename: e.target.value
        });
    }

    submitReport = () => {
        this.setState({
            errMsg: "",
            successMsg: "",
            warningMsg: ""
        })
        if (this.isValidEmail() === false) {
            this.setState({
                errMsg: "Invalid email address",
                successMsg: "",
                warningMsg: ""
            })
            return
        }
        if (this.state.selectedFile.length > 10) {
            this.setState({
                errMsg: "Cannot upload more than 10 files",
                successMsg: "",
                warningMsg: ""
            })
            return
        }
        this.setState({
            errMsg: "",
            successMsg: "",
            warningMsg: "Uploading files and submitting report"
        })
        let fd = new FormData();
        fd.append('userId', localStorage.getItem('GameUserId'))
        fd.append('email', this.state.email)
        fd.append('description', this.state.description)
        for (var file of this.state.selectedFile) {
            fd.append('files', file)
        }
        axios.post(`/users/report`, fd)
        .then(() => {
            this.setState({
                email: '',
                description: '',
                selectedFile: [],
                filename: '',
                errMsg: '',
                successMsg: 'Your report has been submitted',
                warningMsg: ""
            })
        })
        .catch((error) => {
            if (error.response && error.response.status === 400) {
                this.setState({
                    errMsg: error.response.data,
                    successMsg: '',
                    warningMsg: ""
                })
            } else {
                this.setState({
                    errMsg: 'Failed! Please try again later',
                    successMsg: '',
                    warningMsg: ""
                })
            }
        })
    }

    render() {

        if (!localStorage.getItem('GameUserId')) {
            return (<Redirect to="/" />)
        }

        return (
            <div className="row m-5 p-5">
                <div className="col-md-6 offset-md-3">
                    <div className="form-group">
                        <label>Email address <span className="text-danger">*</span></label>
                        <input className="form-control" value={this.state.email} onChange={this.emailChangeHandler} placeholder="We promise that we will not spam your inbox"></input>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" rows="8" style={{ resize: "none" }} value={this.state.description} onChange={this.descriptionChangeHandler} placeholder="Please type in your feedback or help us understand the problem better and attach files if needed"></textarea>
                    </div>
                    <div>
                        <Input type="file" name="image" id="image" multiple="true" onChange={this.onChangeFileUpload} value={this.state.filename} />
                        <FormText color="muted">Attach files</FormText>
                    </div>
                    <div className="text-center">
                        <FormText>Close the tab after you finish :)</FormText>
                    </div>
                    <div className="text-center mt-3 p-3 border-top">
                        <button className="btn btn-primary w-25" onClick={this.submitReport}>Submit</button>
                        <FormText color="success">{this.state.successMsg}</FormText>
                        <FormText color="danger">{this.state.errMsg}</FormText>
                        <FormText color="warning">{this.state.warningMsg}</FormText>
                    </div>
                </div>
            </div>
        )
    }
}
//export ReportIssue Component
export default ReportIssue;