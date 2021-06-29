import React from 'react';
import {Modal} from '@fluentui/react';

/*
*   Modal for signing an item in
*/
export default class SignItemInModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen: props.isOpen,
            item: null
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
                        Sign Item In
                    </div>
                    <div>
                        <button onClick={this.dismissModal}>Close</button>
                    </div>
                </div>
            </Modal>
        );
    };
};