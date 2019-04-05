import React, { Component } from 'react';
import { client } from '@jeffriggle/ipc-bridge-client';
import { addCategory, getCategories, updateCategories } from '../../common/eventNames';
import { isValid, convertToNumeric, convertToDisplay } from '../../common/currencyConversion';
import _ from 'lodash';
import './CategoryConfiguration.scss';

class CategoryConfiguration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pendingCategory: '',
            categories: [],
            pendingChanges: false
        };

        this.boundAvaliable = this.onAvailable.bind(this);
    }

    componentDidMount() {
        //TODO use subscription instead
        if (!client.available) {
            client.on(client.availableChanged, this.boundAvaliable);
        } else {
            client.sendMessage(getCategories, null).then(this.handleCategories.bind(this));
        }
    }

    onAvailable(value) {
        if (value) {
            client.sendMessage(getCategories, null).then(this.handleCategories.bind(this));
            client.removeListener(client.availableChanged, this.boundAvaliable);
        }
    }

    handleCategories(categories) {
        categories.forEach(cat => {
            cat.allocated = convertToDisplay(cat.allocated);
        });

        this.setState({
            categories: categories
        });
    }

    render() {
        return (
            <div className="category-details">
                <h3>Categories</h3>
                <div className="add-category-area">
                    <input 
                        type="text"
                        value={this.state.pendingCategory} 
                        onChange={this.pendingCategoryChanged.bind(this)}
                        onKeyPress={this.handleKeyPress.bind(this)} />
                    <button onClick={this.addCategory.bind(this)}>Add</button>
                </div>
                <div className="existing-categories">
                    {this.state.categories.map(cat => {
                        return (
                            <div className="category" key={cat.name}>
                                <span className="name">{cat.name}</span>
                                <input type="text" value={cat.allocated} onChange={this.updateAllocation(cat)}></input>
                                <span>Rollover</span>
                                <input type="checkbox" checked={cat.rollover} onChange={this.updateRollover(cat)}></input>
                            </div>
                        );
                    })}
                </div>
                <div>
                    <button disabled={!this.state.pendingChanges || this.state.hasError} onClick={this.sendUpdate.bind(this)}>Update Categories</button>
                </div>
            </div>
        );
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.addCategory();
        }
    }

    pendingCategoryChanged(event) {
        this.setState({
            pendingCategory: event.target.value
        });
    }

    addCategory() {
        let cat = {
            name: this.state.pendingCategory,
            allocated: 0,
            rollover: false
        };

        client.sendMessage(addCategory, cat);

        //TODO use subscription instead
        this.state.categories.push(cat);
        this.setState({
            pendingCategory: '',
            categories: this.state.categories
        });
    }

    updateAllocation(category) {
        return (event) => {
            let val = event.target.value;

            category.hasError = !isValid(val);
            category.allocated = event.target.value;
            category.hasChange = true;

            let exisitingError = _.find(this.state.categories, cat => { return cat.hasError; });
            let error = category.hasError || exisitingError && exisitingError.hasError;

            this.setState({
                pendingChanges: true,
                hasError: error
            });
        }
    }

    updateRollover(category) {
        return (event) => {
            category.rollover = event.target.checked;

            this.setState({
                pendingChanges: true
            });
        }
    }

    sendUpdate() {
        this.state.categories.forEach(category => {
            category.allocated = convertToNumeric(category.allocated);
            delete category.hasChange;
            delete category.hasError;
        });

        client.sendMessage(updateCategories, this.state.categories);

        this.setState({
            pendingChanges: false
        });
    }
}

export default CategoryConfiguration;