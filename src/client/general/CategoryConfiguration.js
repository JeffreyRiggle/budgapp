import React, { Component } from 'react';
import nativeService from '../services/nativeService';
import './CategoryConfiguration.scss';

class CategoryConfiguration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pendingCategory: '',
            categories: [],
            pendingChanges: false
        };
    }

    componentDidMount() {
        //TODO use subscription instead
        nativeService.sendMessage('getCategories', null, this.handleCategories.bind(this));
    }

    handleCategories(categories) {
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
                    <button disabled={!this.state.pendingChanges} onClick={this.sendUpdate.bind(this)}>Update Categories</button>
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

        nativeService.sendMessage('addCategory', cat);

        //TODO use subscription instead
        this.state.categories.push(cat);
        this.setState({
            pendingCategory: '',
            categories: this.state.categories
        });
    }

    updateAllocation(category) {
        return (event) => {
            let amount = Number(event.target.value);

            if (!amount && amount !== 0) {
                return;
            }

            category.allocated = event.target.value;
            category.hasChange = true;

            this.setState({
                pendingChanges: true
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
            category.allocated = Number(category.allocated);
            delete category.hasChange
        });

        nativeService.sendMessage('updateCategories', this.state.categories);

        this.setState({
            pendingChanges: false
        });
    }
}

export default CategoryConfiguration;