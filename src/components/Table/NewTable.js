import React, { Component } from 'react';
import './Table/table.css';
import ItemEditControls from '../ItemEditControls';
import UserEditControls from '../UserEditControls';

export default class NewTable extends Component {
    constructor(props){
        super(props)
        this.state = {
            data: props.data,
            item: null,
            id: null,
            contentType: props.contentType
        }
        
    }
    //Included this function, so when toggling between table types, the table actually updates with correct information Ex. Available items display by default, but without this, clicking unavailable the table didnt change
    componentDidUpdate(prevProps, prevState){
        if(this.props!== prevProps){
            this.setState({ 
                data:           this.props.data, 
                contentType:    this.props.contentType, 
                id:             this.props.id 
            });
        }
    }
    
    renderTableData(){
        
            if(this.state.contentType === "Users"){
                return this.state.data.map((user, index) => {
                    const { _id, firstName, lastName, userName, userRole, phoneNumber } = user
                    return(
                        <tr key={_id}>
                        <input type='checkbox' id={_id} onClick={() => {this.setState({id: _id})}}></input>
                        <td>{_id}</td>
                        <td>{firstName}</td>
                        <td>{lastName}</td>
                        <td>{userName}</td>
                        <td>{userRole}</td>
                        <td>{phoneNumber}</td>
                    </tr>
                )})
                
                
            }
            else {
                return this.state.data.map((item, index) => {
                    const { _id, name, description, homeLocation, specificLocation, serialNumber, notes } = item
                    return(
                        
                        <tr key={_id}>
                        <input type='checkbox' id={_id} onClick={() => {this.setState({id: _id})}}></input>
                        <td>{_id}</td>
                        <td>{name}</td>
                        <td>{description}</td>
                        <td>{homeLocation}</td>
                        <td>{specificLocation}</td>
                        <td>{serialNumber}</td>
                        <td>{notes}</td>
                    </tr>
                )
            })
            }
        }
    
    
    renderTableHeader() {
        if(this.state.contentType === "Users"){
            return(
                <thead>
                    <th></th>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Phone Number</th>
                </thead>
            )
        }
        else{
            return(
                <thead>
                    <th></th>
                    <th>ID</th>
                    <th>Item Name</th>
                    <th>Description</th>
                    <th>Location</th>
                    <th>Specific Location</th>
                    <th>Serial Number</th>
                    <th>Notes</th>
                </thead>
            )
        }
    }
        
    
    render(){
        return(
            <div>
            <h1 id='title'></h1>
            <table id='items'>
                    {this.renderTableHeader()}
                <tbody>
                    {this.renderTableData()}
                </tbody>
            </table>
            <div>
            <ItemEditControls id={this.state.id}/>
            </div>
            <pre></pre>
            </div>
            )

        }

    }
    
        









