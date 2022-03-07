import React from 'react';
import {Modal, ThemeSettingName} from '@fluentui/react';
import itemController from '../../controllers/ItemController';
import itemLogController from '../../controllers/ItemLogController';
import userController from '../../controllers/UserController';

/*
*   Modal for signing out an item
*/
export default class SignItemOutModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:        props.isOpen,
            item:          null,
            idArray:       props.idArray,
            users:         [],
            selection:     null,
            userSelected:  {}
        };

        this.dismissModal = this.dismissModal.bind(this);
        this.signItemsOut = this.signItemsOut.bind(this);
        this.assignOptionGroup = this.assignOptionGroup.bind(this);
    };

    async componentDidMount(){
        let users = await userController.getAllUsers();
        this.setState({ users: users });
        this.assignOptionGroup();
    };

    dismissModal() {
        this.setState({isOpen: false});
    };

    async signItemsOut(){
        for(var i = 0; i < this.state.users.length; i++){
            if(this.state.users[i].userName === this.state.selection){
                let user = this.state.users[i];
                await this.setState({ userSelected: user});
                break;
            }
        }
        let info = {
            itemId:      this.state.idArray[0],
            userId:      this.state.userSelected._id,
            custodianId: '',
            action:      'signed out',
            notes:       'test'
        }

        await itemController.signItemOut(this.state.idArray, this.state.selection);
        await itemLogController.createItemLog(info);
        window.location.reload();
        this.dismissModal();
    };

    //method that dynamically generates child option tags to grp option tags in the render 
    assignOptionGroup() {
        for (let i = 0; i < this.state.users.length; i++) {
            let option = document.createElement("option");
                option.append(this.state.users[i].userName);
            if (this.state.users[i].userRole === 'user') {
                document.getElementById('userGroup').append(option);
            } else if (this.state.users[i].userRole === 'admin') {
                document.getElementById('adminGroup').append(option);
            } else if (this.state.users[i].userRole === 'custodian') {
                document.getElementById('custodianGroup').append(option);
            }
            
        }
        
    };

    /* Loops through the array of items and displays them as a list */
    displayArray(idArray){
        const displayID = idArray.map(
            (item) => <li key={ item.toString() } > { item } </li>);

        return(
            <ul> { displayID } </ul>
        );
    };

    /* Useability Feature:
        submit button is only enabled when no errors are detected */
    isSumbitAvailable(){
        if(this.state.selection){
            return true;
        }
        return false;
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className='modalHeader'>
                    <h3>Sign Item Out</h3>                    
                </div>
                <form onSubmit={(Event) => {Event.preventDefault(); this.signItemsOut();}}>
                <div className='modalBody'>
                    <h4>You are about to sign out: </h4>
                    {this.displayArray(this.state.idArray)}
                    <label>Choose a user: </label>
                    <select name='usersS' id='usersS' defaultValue={''} 
                    onChange={(event) => this.setState({ selection: event.target.value})}>
                        <option label='' hidden disabled ></option>
                        <optgroup label='Users' id='userGroup'></optgroup>
                        <optgroup label='Custodians' id='custodianGroup'></optgroup>
                        <optgroup label='Admins' id='adminGroup'></optgroup>
                    </select>
                </div>
                <div className='modalFooter'>
                    { this.isSumbitAvailable() ? <input type='submit'></input> : <input type='submit' disabled></input>}
                    <button type="reset" onClick={this.dismissModal}>Close</button>
                </div>
                </form>
            </Modal>
        );
    }
}