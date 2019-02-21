import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import passwordService from '../services/passwordService';
import './Password.scss';

class PasswordView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            password: '',
            failed: false
        };
    }

    render() {
        return (
            <div className="password-view">
                <h1>Password Protected</h1>
                <div className="info-area">
                    <p>This file is password protected, please enter password to manage file.</p>
                    {this.state.failed && <p className="error">Provided password was incorrect please try again.</p>}
                </div>
                <div className="submit-area">
                    <input 
                        className="password-field" 
                        type="password" 
                        value={this.state.password} 
                        onChange={this.passwordChanged.bind(this)}
                        onKeyPress={this.handleKeyPress.bind(this)}>
                    </input>
                    <button className="submit-btn" onClick={this.sendPassword.bind(this)}>Submit</button>
                </div>
            </div>
        )
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendPassword();
        }
    }

    passwordChanged(event) {
        this.setState({
            password: event.target.value
        });
    }

    sendPassword() {
        this.setState({
            password: ''
        });

        passwordService.sendPassword(this.state.password, this.passwordProvided.bind(this));
    }

    passwordProvided(result) {
        if (result.success) {
            this.props.history.push('/');
            return;
        }

        this.setState({
            failed: true
        });
    }
}

export default withRouter(PasswordView);