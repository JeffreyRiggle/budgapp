import React, { useCallback } from 'react';
import {withRouter} from 'react-router-dom';
import passwordService, {PasswordProvidedResult} from '../services/passwordService';
import './Password.scss';

interface PasswordViewProps {
    history: any;
}

const PasswordView = (props: PasswordViewProps) => {
    const [password, setPassword] = React.useState('');
    const [failed, setFailed] = React.useState(false);

    const passwordChanged = React.useCallback((event) => {
        setPassword(event.target.value);
    }, []);

    const passwordProvided = useCallback((result: PasswordProvidedResult) => {
        if (result.success) {
            props.history.push('/');
            return;
        }

        setFailed(true);
    }, [props.history]);

    const sendPassword = useCallback(() => {
        setPassword('');
        passwordService.sendPassword(password, passwordProvided);
    }, [password, passwordProvided]);

    const handleKeyPress = React.useCallback((event) => {
        if (event.key !== 'Enter') {
            return;
        }

        sendPassword();
    }, [sendPassword]);

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

export default withRouter(React.memo(PasswordView));