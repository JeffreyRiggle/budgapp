import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class AddBudgetItems extends Component {
    render() {
        return (
            <div>
                <h1>Add Budget Items</h1>
                <Link to="/budget">Cancel</Link>
                <Link to="/budget">Add</Link>
            </div>
        )
    }
}

export default AddBudgetItems;