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
            id:     props.id,
            error:  ''
        };

        this.dismissModal = this.dismissModal.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    };

    dismissModal() {
        this.setState({isOpen: false});
    };
    
    async deleteUser() {
        await UserController.deleteUser(this.state.id)
        .then((auth) => {
            if(auth.status !== undefined && auth.status >= 400) throw auth;
            this.setState({error: ''});
            window.location.reload();
            this.dismissModal();
        })
        .catch(async (err) => {            
            this.setState({error: err.message});
        });
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className='modalHeader'>
                    <h3>Delete User</h3>
                </div>
                <div className='modalBody'>
                    {this.state.error}
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