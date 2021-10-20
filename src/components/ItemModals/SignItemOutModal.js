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
        let response = await itemController.signItemOut(this.state.idArray);
        this.dismissModal();
    }

    dismissModal() {
        this.setState({isOpen: false});
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div>
                    <div className='header'>
                        Sign Item Out                    
                    </div>
                    <div>You are about to sign out: </div>
                    <div>{this.state.idArray}</div>
                    <div>
                        <button onClick={this.signItemsOut}>Submit</button>
                    </div>
                    <div>
                        <button onClick={this.dismissModal}>Close</button>
                    </div>
                </div>
            </Modal>
        );
    };
};