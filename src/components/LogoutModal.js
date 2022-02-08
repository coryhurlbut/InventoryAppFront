import React from 'react';
import {Modal} from '@fluentui/react';
import {loginLogoutController} from '../controllers/LoginLogoutController';
import '../styles/Modal.css';

/*
*   Modal for logging out
*/
export default class LogoutModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isOpen:     props.isOpen,
        };

        this.logout         = this.logout.bind(this);
        this.dismissModal   = this.dismissModal.bind(this);
    };

    async logout() {
        await loginLogoutController.logout(this.props.auth).then(() => this.props.clearAuth())
        this.dismissModal();
    };

    dismissModal() {
        this.setState({isOpen: false});
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className='modalHeader'>
                        Log Out
                </div>
                <div className='modalFooter'>
                    <button onClick={this.logout}>Log Out</button>
                    <button onClick={this.dismissModal}>Close</button>
                </div>
            </Modal>
        );
    };
};