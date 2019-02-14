import React, { Component } from 'react';
import nativeService from '../NativeService';

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
            <div>
                <h3>Categories</h3>
                <div>
                    <input type="text" value={this.state.pendingCategory} onChange={this.pendingCategoryChanged.bind(this)} />
                    <button onClick={this.addCategory.bind(this)}>Add</button>
                </div>
                <div>
                    {this.state.categories.map(cat => {
                        return (
                            <div key={cat.name}>
                                <span>{cat.name}</span>
                                <input type="text" value={cat.allocated} onChange={this.updateAllocation(cat)}></input>
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

    pendingCategoryChanged(event) {
        this.setState({
            pendingCategory: event.target.value
        });
    }

    addCategory() {
        let cat = {
            name: this.state.pendingCategory,
            allocated: 0
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

            category.allocated = amount;
            category.hasChange = true;

            this.setState({
                pendingChanges: true
            });
        }
    }

    sendUpdate() {
        this.state.categories.forEach(category => {
            delete category.hasChange
        });

        nativeService.sendMessage('updateCategories', this.state.categories);

        this.setState({
            pendingChanges: false
        });
    }
}

export default CategoryConfiguration;