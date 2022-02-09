import React from 'react';
import {Modal} from '@fluentui/react';
import itemController from '../../controllers/ItemController';

/*
*   Modal for signing an item in
*/
export default class SignItemInModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen: props.isOpen,
            item: null,
            idArray: props.idArray
        };

        this.dismissModal = this.dismissModal.bind(this);
        this.signItemsIn = this.signItemsIn.bind(this);
    };

    async signItemsIn(){
        await itemController.signItemIn(this.state.idArray);
        window.location.reload(false);
        this.dismissModal();
    };

    dismissModal() {
        this.setState({isOpen: false});
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className='modalHeader'>
                    Sign Item In
                </div>
                <div className='modalBody'>
                    <div>You are about to sign back in:</div>
                    <div>{this.state.idArray}</div>
                </div>
                <div className='modalFooter'>
                    <button onClick={this.signItemsIn}>Submit</button>
                    <button onClick={this.dismissModal}>Close</button>
                </div>
            </Modal>
        );
    };
};