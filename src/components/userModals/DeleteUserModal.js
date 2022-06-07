import React                from 'react';

import { Modal }            from '@fluentui/react';

import { userController, 
        adminLogController, 
        itemController }    from '../../controllers';

/*
*   Modal for deleting a user
*/
const MODAL_HEADER_TITLE = 'Delete User';

const MODAL_PROMPT = 'You are about to delete the following:';

const BTN_DELETE = 'Delete';
const BTN_CLOSE = 'Close';

export default class DeleteUserModal extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen          : props.isOpen,
            selectedIds     : props.selectedIds,
            selectedObjects : props.selectedObjects,
            isError         : false,
            errorMessage    : ''
        };
    }

    _dismissModal = () => {
        this.setState({isOpen: false});
    }
    
    _deleteUser = async () => {
        //grabs all unavailable/signed out items
        let unavailableItems = await itemController.getUnavailableItems();
        
        //Checks if any user that is going to get deleted has any items signed out
        let res = await userController.checkSignouts(this.state.selectedObjects, unavailableItems);
        if(res.status === 'error') {
            this.setState({ 
                isError: true, 
                errorMessage: res.message 
            });
            return;
        } else {
            this.setState({ 
                isError: false, 
                errorMessage: ''
            });
        };

        await userController.deleteUsers(this.state.selectedIds)
        .then( async (auth) => {
            if(auth.status !== undefined && auth.status >= 400) throw auth;
            this.setState({ 
                isError: false, 
                errorMessage: ''
            });

            //we need to loop since there is a strong possibility of multiple users being deleted
            //which each require a log event
            for(let i = 0; i < this.state.selectedIds.length; i++) {
                let log = {
                    itemId:     'N/A',
                    userId:     this.state.selectedIds[i],
                    adminId:    '',
                    action:     'delete',
                    content:    'user'
                };
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
    _displayArray = (users) => {
        try {
            const displayUsers = users.map((user) => 
                <li className="arrayObject" key={user.userName}> 
                    {user.userName} : {user.firstName} {' '} {user.lastName}
                </li>
            );

            return <ul>{displayUsers}</ul>;
        } catch (error) {
            alert("An error has occured. Contact Admin.");
        }
    }

    /* Builds display for deleting users */
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
                    {this._displayArray(this.state.selectedObjects)}
                </div>
                <div className="modalFooter">
                    <button onClick={this._deleteUser}>{BTN_DELETE}</button>
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