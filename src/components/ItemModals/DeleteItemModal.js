import React                from 'react';
import { Modal }            from '@fluentui/react';
import itemController       from '../../Controllers/ItemController';
import adminLogController   from '../../Controllers/AdminLogController';

/*
*   Modal for deleting an item
*/
export default class DeleteItemModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:  props.isOpen,
            item:    null,
            idArray: props.idArray,
            selectedObjects: props.selectedObjects,
            isControllerError:      false,
            controllerErrorMessage: ''
        };
    };

    dismissModal() {
        this.setState({ isOpen: false });
    };

    async deleteItem() {
        await itemController.deleteItems(this.state.idArray)
        .then( async (auth) => {
            if(auth.status !== undefined && auth.status >= 400) throw auth;
            this.setState({ isControllerError: false, 
                            controllerErrorMessage: ''});

            for (let i = 0; i < this.state.idArray.length; i++) {
                let log = {
                    itemId:     this.state.idArray[i],
                    userId:     'N/A',
                    adminId:    '',
                    action:     'delete',
                    content:    'item'
                };
                await adminLogController.createAdminLog(log);
            };

            window.location.reload();
            this.dismissModal();
        })
        .catch(async (err) => {            
            this.setState({ isControllerError: true, 
                            controllerErrorMessage: err.message});
        });
    };

    /* Loops through the array of items and displays them as a list */
    displayArray(items){
        const displayItem = items.map(
            (item) => <li className='arrayObject' key={ item._id } > { item.name } </li>);

        return(
            <ul> { displayItem } </ul>
        );
    };

    /* Builds display for deleting items */
    buildDeleteNotification(){
        return(
            <>
            <div className='modalHeader'>
                <h3>Delete Item</h3>
            </div>
            <div className='modalBody'>
                <h4>You are about to delete the following:</h4>
                {this.displayArray(this.state.selectedObjects)}
            </div>
            <div className='modalFooter'>
                <button onClick={() => this.deleteItem()}>Delete</button>
                <button onClick={() => this.dismissModal()}>Close</button>
            </div>
            </>
        );
    };

    /* If a backend issue occurs, display message to user */
    buildErrorDisplay(){
        return(
            <>
            <div className='modalHeader'>
                <h3>Error Has Occured</h3>
            </div>
            <div className='modalBody'>
                <p className='errorMesage'> {this.state.controllerErrorMessage} </p>
            </div>
            <div className='modalFooter'>
                <button type="reset" onClick={() => this.dismissModal()}>Close</button>
            </div>
            </>
        );
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                { this.state.isControllerError ? this.buildErrorDisplay() : this.buildDeleteNotification() }
            </Modal>
        );
    };
};