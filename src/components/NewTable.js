import React, { Component } from 'react'
import './Table/table.css'
import { AddItemModal, EditItemModal, DeleteItemModal } from './ItemModals';

export default class NewTable extends Component {
    constructor(props){
        super(props)
        this.state = {
            data: props.data,
            item: null,
            modal: null,
            id: null
        }

        this.hideModal  = this.hideModal.bind(this);
        this.addItem    = this.addItem.bind(this);
        this.editItem   = this.editItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        
    }
    //Included this function, so when toggling between table types, the table actually updates with correct information Ex. Available items display by default, but without this, clicking unavailable the table didnt change
    componentDidUpdate(prevProps, prevState){
        if(this.props.data !== prevProps.data){
            this.setState({ data: this.props.data });
        }
    }
    

    addItem () {
        this.setState({modal: <AddItemModal isOpen={true} hideModal={this.hideModal}/>});
    };

    editItem () {
        this.setState({modal: <EditItemModal isOpen={true} hideModal={this.hideModal}/>});
    };

    deleteItem () {
        this.setState({modal: <DeleteItemModal isOpen={true} id={this.state.id} hideModal={this.hideModal}/>});
    };

    hideModal() {
        this.setState({modal: null});
    };
    
    


    renderTableData(){
        return this.state.data.map((item, index) => {
            const { _id, name, description, homeLocation, serialNumber, notes } = item
            
            return(
                <tr key={_id}>
                    <input type='checkbox' id={_id} onClick={() => {this.setState({id: _id})}}></input>
                    <td>{_id}</td>
                    <td>{name}</td>
                    <td>{description}</td>
                    <td>{homeLocation}</td>
                    <td>{serialNumber}</td>
                    <td>{notes}</td>
                </tr>
            )
        })
    }
    
    
    render() {
        return(
            <div>
            <h1 id='title'></h1>
            <table id='items'>
                <thead>
                    <th></th>
                    <th>ID</th>
                    <th>Item Name</th>
                    <th>Description</th>
                    <th>Location</th>
                    <th>Serial Number</th>
                    <th>Notes</th>
                </thead>
                <tbody>
                    {this.renderTableData()}
                </tbody>
            </table>
            <div>
                <button onClick={this.addItem}>
                    Add Item
                </button>
                <button onClick={this.editItem}>
                    Edit Item
                </button>
                <button onClick={this.deleteItem}>
                    Delete Item
                </button>
                {this.state.modal}
            </div>
            <pre></pre>
            </div>
            
    )
}



//A way to generate header based off of key from incoming database info, doesn't work well with current mongodb database 
// renderTableHeader() {
//     if (this.state.data.length < 1) {
//         return "No Data";
//     }

//     let header = Object.keys(this.state.data[0]);
//     if(key != _id){
//         console.log(this.state.data[0]);
//         return header.map((key, index) => {
//             console.log(key, index);
//             return <th key={index}>{key}</th>
//         })
//     }
    
// }
}



