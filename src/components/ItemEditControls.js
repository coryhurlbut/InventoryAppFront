import React from 'react';
import '@fluentui/react';
import { AddItemModal, EditItemModal, DeleteItemModal } from './ItemModals';

/*
*   Displays the buttons for adding, deleting and editing items
*/
export default class ItemEditControls extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            item:  null,
            modal: null,
            id: props.id,
            parents: props.parents,
            idArray: props.idArray
        };

        this.hideModal  = this.hideModal.bind(this);
        this.addItem    = this.addItem.bind(this);
        this.editItem   = this.editItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    };

    componentDidUpdate(prevProps, prevState){
        if(this.props.id !== prevProps.id){
            this.setState({ id: this.props.id });
        }
    }

    addItem () {
        this.setState({modal: <AddItemModal isOpen={true} id={this.state.id} parents={this.state.parents} hideModal={this.hideModal}/>});
    };

    editItem () {
        this.setState({modal: <EditItemModal isOpen={true} id={this.state.id} hideModal={this.hideModal}/>});
    };

    deleteItem () {
        this.setState({modal: <DeleteItemModal isOpen={true} id={this.state.id} hideModal={this.hideModal} idArray={this.state.idArray}/>});
    };

    hideModal() {
        this.setState({modal: null});
    };

    render() {
        return (
            <div>
                <button onClick={this.addItem}>
                    Add Item
                </button>
                <button onClick={this.editItem} disabled={this.state.idArray.length > 1 ? true : false}>
                    Edit Item
                </button>
                <button onClick={this.deleteItem}>
                    Delete Item
                </button>
                {this.state.modal}
            </div>
        );
    };
};