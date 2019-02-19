import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import passwordService from './services/passwordService';

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
            <div>
                <h1>Password Protected</h1>
                <p>This file is password protected, please enter password to manage file.</p>
                {this.state.failed && <p>Provided password was incorrect please try again.</p>}
                <input type="password" value={this.state.password} onChange={this.passwordChanged.bind(this)}></input>
                <button onClick={this.sendPassword.bind(this)}>Submit</button>
            </div>
        )
    }

    passwordChanged(event) {
        this.setState({
            password: event.target.value
        });
    }

    sendPassword() {
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