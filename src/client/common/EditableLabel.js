import React, {Component} from 'react';

class EditableLabel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value || '',
            editing: false
        }
    }

    render() {
        if (this.state.editing) {
            return this.renderEditing();
        }

        return this.renderLabel();
    }

    renderEditing() {
        return (
            <div>
                <input type="text" value={this.state.value} onChange={this.updateValue.bind(this)} onKeyPress={this.handleKeyPress.bind(this)}/>
            </div>
        );
    }

    renderLabel() {
        return (
            <div>
                <label>{this.state.value}</label>
                <button onClick={this.enterEdit.bind(this)}>Edit</button>
            </div>
        )
    }

    enterEdit() {
        this.setState({
            editing: true
        });
    }

    updateValue(event) {
        this.setState({
            value: event.target.value
        });
    }

    handleKeyPress(event) {
        if (event.key !== 'Enter') {
            return;
        }

        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }

        this.setState({
            editing: false
        });
    }
}

export default EditableLabel;