import React from 'react';
import {Modal} from '@fluentui/react';
import UserController from '../../controllers/UserController';

/*
*   Modal for deleting a user
*/
export default class DeleteUserModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen: props.isOpen,
            user: null,
            id: props.id
        };

        this.dismissModal = this.dismissModal.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    };

    dismissModal() {
        this.setState({isOpen: false});
    };
    
    async deleteUser() {
        let id = this.state.id
        let response = await UserController.deleteUser(id);
        this.dismissModal();
    }

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div>
                    <div className='header'>
                        Delete User
                    </div>
                    <p>Are you sure you want to delete?</p>
                    <div>
                        <button onClick={() => {this.deleteUser()}}>Delete</button>
                    </div>
                    <div>
                        <button onClick={this.dismissModal}>Close</button>
                    </div>
                </div>
            </Modal>
        );
    };
};