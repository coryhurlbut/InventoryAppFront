import React from 'react';
import {Modal} from '@fluentui/react';
import itemController from '../../controllers/ItemController';

/*
*   Modal for signing out an item
*/
export default class SignItemOutModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen: props.isOpen,
            id: props.id,
            item: null,
            idArray: props.idArray
        };

        this.dismissModal = this.dismissModal.bind(this);
        this.signItemsOut = this.signItemsOut.bind(this);
    };

    async signItemsOut(){
        await itemController.signItemOut(this.state.idArray);
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
                    <h3>Sign Item Out</h3>                    
                </div>
                <div className='modalBody'>
                    <h4>You are about to sign out: </h4>
                    <p>{this.state.idArray}</p>
                </div>
                <div className='modalFooter'>
                    <button onClick={this.signItemsOut}>Submit</button>
                    <button onClick={this.dismissModal}>Close</button>
                </div>
            </Modal>
        );
    };
};