import React                from 'react';
import { Modal }            from '@fluentui/react';
import { ItemController, 
        ItemLogController } from '../../controllers'

/*
*   Modal for signing an item in
*/
export default class SignItemInModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:  props.isOpen,
            idArray: props.idArray,
            selectedObjects: props.selectedObjects
        };
    };

    dismissModal() {
        this.setState({ isOpen: false });
    };

    async signItemsIn(){
        await ItemController.signItemIn(this.state.idArray)
        .then( async (auth) => {
            if(auth.status !== undefined && auth.status >= 400) throw auth;
            this.setState({ error: '', isError: false });

            for (let i = 0; i < this.state.idArray.length; i++) {
                let info = {
                    itemId:      this.state.idArray[0],
                    userId:      'test',
                    custodianId: '',
                    action:      'signed in',
                    notes:       'test'
                };
                await ItemLogController.createItemLog(info);
            };

            window.location.reload();
            this.dismissModal();
        })
        .catch(async (err) => {            
            this.setState({ error: err.message, isError: true });
        });
    };

    /* Loops through the array of items and displays them as a list */
    displayArray(items){
        const displayItem = items.map(
            (item) => <li key={ item._id } > { item.name } </li>);

        return(
            <ul> { displayItem } </ul>
        );
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className='modalHeader'>
                    <h3>Sign Item In</h3>
                </div>
                <div className='modalBody'>
                    <h4>You are about to sign back in:</h4>
                    {this.displayArray(this.state.selectedObjects)}
                </div>
                <div className='modalFooter'>
                    <button onClick={() => this.signItemsIn()}>Submit</button>
                    <button onClick={() => this.dismissModal()}>Close</button>
                </div>
            </Modal>
        );
    };
};