import React from 'react';

export interface EditableLabelProps {
    value?: string;
    onChange?: (value: string) => void;
}

const EditableLabel = (props: EditableLabelProps) => {
    const { value, onChange } = props;
    const [editValue, setEditValue] = React.useState(value || '');
    const [editing, setEditing] = React.useState(false);

    const updateValue = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setEditValue(event.target.value);
    }, []);

    const handleKeyPress = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') {
            return;
        }

        if (onChange) {
            onChange(editValue);
        }

        setEditing(false);
    }, [onChange, editValue]);

    const enterEdit = React.useCallback(() => {
        setEditing(true);
    }, []);

    if (editing) {
        return (
            <div>
                <input type="text" value={editValue} onChange={updateValue} onKeyPress={handleKeyPress}/>
            </div>
        );
    }

    return (
        <div>
            <label>{editValue}</label>
            <button onClick={enterEdit}>Edit</button>
        </div>
    );
}

export default React.memo(EditableLabel);