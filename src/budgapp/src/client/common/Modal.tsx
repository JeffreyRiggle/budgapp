import React from 'react';

import 'react-datepicker/dist/react-datepicker.css';
import './Modal.scss';

export interface ModalProps {
    title: string;
    onAccept: () => void;
    onCancel: () => void;
    children?: JSX.Element;
}

const ModalComponent: React.FC<ModalProps> = ({
    title,
    onAccept,
    onCancel,
    children
}) => {
    return (
        <div className="modal">
            <h1 className="modal-header">{title}</h1>
            <div className="modal-content">
                {children}
            </div>
            <div className="modal-footer">
                <button onClick={onCancel} className="secondary-button" data-testid="cancel-modal">Cancel</button>
                <button onClick={onAccept} className="primary-button" data-testid="accept-modal">Add</button>
            </div>
        </div>
    )
}

export default React.memo(ModalComponent);