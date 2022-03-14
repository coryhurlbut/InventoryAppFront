import React                from 'react';
import { Modal }            from '@fluentui/react';
import itemController       from '../../controllers/ItemController';
import adminLogController   from '../../controllers/AdminLogController';

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
            error:   '',
            isError: false
        };
    };

    dismissModal() {
        this.setState({isOpen: false});
    };

    async deleteItem() {
        await itemController.deleteItems(this.state.idArray)
        .then( async (auth) => {
            if(auth.status !== undefined && auth.status >= 400) throw auth;
            this.setState({ error: '', isError: false });

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
            </Modal>
        );
    };
};