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
            isOpen: props.isOpen,
            item: null,
            idArray: props.idArray,
            users: [],
            selection: null,
            userSelected:  {}
        };

        this.dismissModal = this.dismissModal.bind(this);
        this.signItemsOut = this.signItemsOut.bind(this);
        this.assignOptionGroup = this.assignOptionGroup.bind(this);
    }

    async componentDidMount(){
        let users = await userController.getAllUsers();
        this.setState({ users: users });
        this.assignOptionGroup();
    }

    async signItemsOut(){
        for(var i = 0; i < this.state.users.length; i++){
            if(this.state.users[i].userName === this.state.selection){
                let user = this.state.users[i];
                await this.setState({ userSelected: user});
                break;
            }
        }
        let info = {
            itemId: this.state.idArray[0],
            userId: this.state.userSelected._id,
            custodianId: '',
            action: 'signed out',
            notes:  'test'
        }

        await itemController.signItemOut(this.state.idArray);
        await itemLogController.createItemLog(info);
        window.location.reload(false);
        this.dismissModal();
    }

    dismissModal() {
        this.setState({isOpen: false});
    }

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
    }

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className='modalHeader'>
                    <h3>Sign Item Out</h3>                    
                </div>
                <form onSubmit={(Event) => {Event.preventDefault(); this.signItemsOut();}}>
                <div className='modalBody'>
                    
                    <h4>You are about to sign out: </h4>
                    <p>{this.state.idArray}</p>
                    <label>Choose a user: </label>
                    <select name='usersS' id='usersS' defaultValue='' required 
                    onChange={(event) => this.setState({ selection: event.target.value})}>
                        <option label='' hidden disabled selected></option>
                        <optgroup label='Users' id='userGroup'></optgroup>
                        <optgroup label='Custodians' id='custodianGroup'></optgroup>
                        <optgroup label='Admins' id='adminGroup'></optgroup>
                    </select>
                </div>
                <div className='modalFooter'>
                    <input type='submit'></input>
                    <button onClick={this.dismissModal}>Close</button>
                </div>
                </form>
            </Modal>
        );
    }
}