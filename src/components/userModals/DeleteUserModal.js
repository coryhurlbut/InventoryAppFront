import React                from 'react';

import {Modal}              from '@fluentui/react';

import {UserController, 
        AdminLogController, 
        ItemController}     from '../../controllers';

/*
*   Modal for deleting a user
*/
export default class DeleteUserModal extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:                 props.isOpen,
            idArray:                props.idArray,
            selectedObjects:        props.selectedObjects,
            isControllerError:      false,
            controllerErrorMessage: ''
        };
    };

    _dismissModal() {
        this.setState({isOpen: false});
    };
    
    async _deleteUser() {
        let unavailableItems = await ItemController.getUnavailableItems();
        
        //Checks if any user that is going to get deleted has any items signed out
        let res = await UserController.checkSignouts(this.state.selectedObjects, unavailableItems);
        if(res.status === 'error') {
            this.setState({ isControllerError: true, 
                            controllerErrorMessage: res.message
            });
            return;
        } else {
            this.setState({ isControllerError: false, 
                            ercontrollerErrorMessageror: ''
            });
        };

        await UserController.deleteUsers(this.state.idArray)
        .then(async (auth) => {
            if(auth.status !== undefined && auth.status >= 400) throw auth;
            this.setState({ isControllerError: false, 
                            controllerErrorMessage: ''
            });

            for(let i = 0; i < this.state.idArray.length; i++) {
                let log = {
                    itemId:     'N/A',
                    userId:     this.state.idArray[i],
                    adminId:    '',
                    action:     'delete',
                    content:    'user'
                };
                await AdminLogController.createAdminLog(log);
            };
            window.location.reload();
            this._dismissModal();
        })
        .catch(async (err) => {            
            this.setState({ isControllerError: true, 
                            controllerErrorMessage: err.message
            }); 
        });
    };

    /* Loops through the array of items and displays them as a list */
    _displayArray(users) {
        const displayUsers = users.map((user) => 
            <li className='arrayObject' key={user._id}> 
                {user.userName}
            </li>
        );

        return(
            <ul>{displayUsers}</ul>
        );
    };

    /* Builds display for deleting users */
    _buildDeleteNotification() {
        return(
            <>
            <div className='modalHeader'>
                <h3>Delete User</h3>
            </div>
            <div className='modalBody'>
                <h4>You are about to delete the following:</h4>
                {this._displayArray(this.state.selectedObjects)}
            </div>
            <div className='modalFooter'>
                <button onClick={() => this._deleteUser()}>Delete</button>
                <button onClick={() => this._dismissModal()}>Close</button>
            </div>
            </>
        );
    };

    /* If a backend issue occurs, display message to user */
    _buildErrorDisplay() {
        return(
            <>
            <div className='modalHeader'>
                <h3>Error Has Occured</h3>
            </div>
            <div className='modalBody'>
                <p className='errorMesage'>
                    {this.state.controllerErrorMessage}
                </p>
            </div>
            <div className='modalFooter'>
                <button type="reset" onClick={() => this._dismissModal()}>Close</button>
            </div>
            </>
        );
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                {this.state.isControllerError ? this._buildErrorDisplay() : this._buildDeleteNotification()}
            </Modal>
        );
    };
};