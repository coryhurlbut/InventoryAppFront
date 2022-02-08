import React from 'react';
import {Modal} from '@fluentui/react';
import UserController from '../../controllers/UserController';
import '../../styles/Modal.css';

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
        await UserController.deleteUser(id);
        window.location.reload();
        this.dismissModal();
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className='modalHeader'>
                    Delete User
                </div>
                <div className='modalBody'>
                    <p>Are you sure you want to delete?</p>
                </div>
                <div className='modalFooter'>
                    <button onClick={() => {this.deleteUser()}}>Delete</button>
                    <button onClick={this.dismissModal}>Close</button>
                </div>
            </Modal>
        );
    };
};