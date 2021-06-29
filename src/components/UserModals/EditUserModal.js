import React from 'react';
import {Modal} from '@fluentui/react';

/*
*   Modal for editing a user
*/
export default class EditUserModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen: props.isOpen,
            user: null
        };

        this.dismissModal = this.dismissModal.bind(this);
    };

    dismissModal() {
        this.setState({isOpen: false});
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div>
                    <div className='header'>
                        Edit User
                    </div>
                    <div>
                        <button onClick={this.dismissModal}>Close</button>
                    </div>
                </div>
            </Modal>
        );
    };
};