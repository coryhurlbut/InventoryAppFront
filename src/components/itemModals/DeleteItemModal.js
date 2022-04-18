import React                from 'react';

import { Modal }            from '@fluentui/react';

import { itemController,
    adminLogController }    from '../../controllers';

/*
*   Modal for deleting an item
*/
export default class DeleteItemModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:  props.isOpen,
            isControllerError:      false,
            controllerErrorMessage: ''
        };

        this._selectedIds = props.selectedIds;
        this._selectedObjects = props.selectedObjects;
    }

    _dismissModal = () => {
        this.setState({ isOpen: false });
    }

    _deleteItem = async () => {
        await itemController.deleteItems(this._selectedIds)
        .then( async (auth) => {
            if(auth.status !== undefined && auth.status >= 400) throw auth;
            this.setState({ 
                isControllerError: false, 
                controllerErrorMessage: ''
            });

            for(let i = 0; i < this._selectedIds.length; i++) {
                let log = {
                    itemId:     this._selectedIds[i],
                    userId:     'N/A',
                    adminId:    '',
                    action:     'delete',
                    content:    'item'
                };

                //TODO: add error handling for log API call
                await adminLogController.createAdminLog(log);
            };

            window.location.reload();
            this._dismissModal();
        })
        .catch(async (err) => {            
            this.setState({ 
                isControllerError: true, 
                controllerErrorMessage: err.message
            });
        });
    }

    /* Loops through the array of items and displays them as a list */
    _displayArray = (items) => {
        const displayItem = items.map((item) => {
            return <li className="arrayObject" key={item.itemNumber}> 
                {item.name} 
            </li>
        });

        return <ul>{displayItem}</ul>;
    }

    /* Builds display for deleting items */
    _buildDeleteNotification = () => {
        return(
            <>
                <div className="modalHeader">
                    <h3>Delete Item</h3>
                </div>
                <div className="modalBody">
                    <h4>You are about to delete the following:</h4>
                    {this._displayArray(this._selectedObjects)}
                </div>
                <div className="modalFooter">
                    <button onClick={this._deleteItem}>Delete</button>
                    <button onClick={this._dismissModal}>Close</button>
                </div>
            </>
        );
    }

    /* If a backend issue occurs, display message to user */
    _buildErrorDisplay = () => {
        return(
            <>
                <div className="modalHeader">
                    <h3>Error Has Occured</h3>
                </div>
                <div className="modalBody">
                    <p className="errorMesage">
                        {this.state.controllerErrorMessage}
                    </p>
                </div>
                <div className="modalFooter">
                    <button type="reset" onClick={this._dismissModal}>Close</button>
                </div>
            </>
        );
    }

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                {this.state.isControllerError ? this._buildErrorDisplay() : this._buildDeleteNotification()}
            </Modal>
        );
    }
}