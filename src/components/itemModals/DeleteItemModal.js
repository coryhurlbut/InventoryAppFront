import React                from 'react';

import { Modal }            from '@fluentui/react';

import { itemController,
    adminLogController }    from '../../controllers';

/*
*   Modal for deleting an item
*/
const MODAL_HEADER_TITLE = 'Delete Item';

const MODAL_PROMPT = 'You are about to delete the following:';

const BTN_DELETE = 'Delete';
const BTN_CLOSE = 'Close';

export default class DeleteItemModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:  props.isOpen,

            isError:      false,
            errorMessage: ''
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
                isError: false, 
                errorMessage: ''
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
                isError: true, 
                errorMessage: err.message
            });
        });
    }

    /* Loops through the array of items and displays them as a list */
    _displayArray = (items) => {
        const displayItem = items.map((item) => {
            return <li className="arrayObject" key={item.itemNumber}> 
                {item.itemNumber} : {item.name}
            </li>
        });

        return <ul>{displayItem}</ul>;
    }

    /* Builds display for deleting items */
    _renderDeleteNotification = () => {
        return(
            <>
                <div className="modalHeader">
                    <h3>{MODAL_HEADER_TITLE}</h3>
                </div>
                <div className="modalBody">
                    {this.state.isError ?
                        this._renderErrorMessage() :
                        null
                    }
                    <h4>{MODAL_PROMPT}</h4>
                    {this._displayArray(this._selectedObjects)}
                </div>
                <div className="modalFooter">
                    <button onClick={this._deleteItem}>{BTN_DELETE}</button>
                    <button onClick={this._dismissModal}>{BTN_CLOSE}</button>
                </div>
            </>
        );
    }

    /* If a backend issue occurs, display message to user */
    _renderErrorMessage = () => {
        return (
            <label className="errorMessage">
                *{this.state.errorMessage}
            </label>
        );
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                {this._renderDeleteNotification()}
            </Modal>
        );
    }
}