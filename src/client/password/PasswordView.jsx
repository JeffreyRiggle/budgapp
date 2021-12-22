import React from 'react';
import {withRouter} from 'react-router-dom';
import passwordService from '../services/passwordService';
import './Password.scss';

const PasswordView = (props) => {
    const [password, setPassword] = React.useState('');
    const [failed, setFailed] = React.useState(false);

    const passwordChanged = React.useCallback((event) => {
        setPassword(event.target.value);
    });

    function passwordProvided(result) {
        if (result.success) {
            props.history.push('/');
            return;
        }

        setFailed(true);
    }

    function sendPassword() {
        setPassword('');
        passwordService.sendPassword(password, passwordProvided);
    }

    const handleKeyPress = React.useCallback((event) => {
        if (event.key !== 'Enter') {
            return;
        }

        sendPassword();
    });

    return (
        <div className="password-view">
            <h1>Password Protected</h1>
            <div className="info-area">
                <p>This file is password protected, please enter password to manage file.</p>
                {failed && <p className="error">Provided password was incorrect please try again.</p>}
            </div>
            <div className="submit-area">
                <input 
                    className="password-field" 
                    type="password" 
                    value={password} 
                    onChange={passwordChanged}
                    onKeyPress={handleKeyPress}>
                </input>
                <button className="submit-btn" onClick={sendPassword}>Submit</button>
            </div>
        </div>
    )
}

export default withRouter(PasswordView);