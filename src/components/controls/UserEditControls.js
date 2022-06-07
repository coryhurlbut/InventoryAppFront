import React from 'react';

import { AddUserModal, 
    DeleteUserModal, 
    EditUserModal } from '../userModals';

/*
*   Displays the buttons for adding, deleting and editing users
*/
const BTN_ADD_USER_TXT = 'Add User';
const BTN_EDIT_USER_TXT = 'Edit User';
const BTN_DELETE_USER_TXT = 'Delete User';

export default class UserEditControls extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modal           : null,
            accountRole     : props.accountRole,
            selectedIds     : props.selectedIds,
            selectedObjects : props.selectedObjects
        };
    }

    //assigns passed props to state variables, which are selected items from table and role of logged in user
    componentDidUpdate(prevProps, prevState) {
        if(prevProps !== this.props) {
            this.setState({ 
                accountRole     : this.props.accountRole,
                selectedIds     : this.props.selectedIds,
                selectedObjects : this.props.selectedObjects
            });
        };
    }
    
    /**
     * different methods to render appropriate modals based on what button was clicked
     */
    _addUser = () => {
        this.setState({
            modal: <AddUserModal 
                isOpen
                userRole={null}
                hideModal={this.hideModal}
            />
        });
    }

    _editUser = () => {
        this.setState({
            modal: <EditUserModal 
                isOpen
                hideModal={this.hideModal} 
                selectedIds={this.state.selectedIds} 
                selectedObjects={this.state.selectedObjects} 
            />
        });
    }

    _deleteUser = () => {
        this.setState({
            modal: <DeleteUserModal 
                isOpen
                hideModal={this.hideModal} 
                selectedIds={this.state.selectedIds} 
                selectedObjects={this.state.selectedObjects} 
            />
        });
    }

    //we set modal to null to avoid soft crashing the page
    hideModal = () => {
        this.setState({ modal: null });
    }

    /**
     * render which displays the actual buttons and also relies on turnary operators to configure proper button availability based on selected items
     */
    _buildButtons = () => {
        return(
            <div className="Edit_Controls">
                <button 
                    onClick={this._addUser}
                    hidden={!(this.state.accountRole !== 'user')}
                >
                    {BTN_ADD_USER_TXT}
                </button>
                <button 
                    onClick={this._editUser} 
                    disabled={this.state.selectedIds === undefined || this.state.selectedIds.length !== 1}
                    hidden={this.state.accountRole === 'custodian'}
                >
                    {BTN_EDIT_USER_TXT}
                </button>
                <button 
                    onClick={this._deleteUser} 
                    disabled={this.state.selectedIds === undefined || this.state.selectedIds.length === 0}
                    hidden={this.state.accountRole === 'custodian'}
                >
                    {BTN_DELETE_USER_TXT}
                </button>
                {this.state.modal}
            </div>
        );
    }

    render() {
        return this._buildButtons();
    }
}