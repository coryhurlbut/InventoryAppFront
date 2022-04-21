import React                from 'react';

import { Modal }            from '@fluentui/react';

import { userController, 
        adminLogController, 
        itemController }    from '../../controllers';

/*
*   Modal for deleting a user
*/
export default class DeleteUserModal extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:                 props.isOpen,
            selectedIds:            props.selectedIds,
            selectedObjects:        props.selectedObjects,

            isError:                false,
            errorMessage:           ''
        };
    }

    _dismissModal = () => {
        this.setState({isOpen: false});
    }
    
    _deleteUser = async () => {
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
        const displayUsers = users.map((user) => 
            <li className="arrayObject" key={user.userName}> 
                {user.userName}
            </li>
        );

        return <ul>{displayUsers}</ul>;
    }

    /* Builds display for deleting users */
    _renderDeleteNotification = () => {
        return(
            <>
                <div className="modalHeader">
                    <h3>Delete User</h3>
                </div>
                <div className="modalBody">
                    {this.state.isError ?
                        this._renderErrorMessage() :
                        null
                    }
                    <h4>You are about to delete the following:</h4>
                    {this._displayArray(this.state.selectedObjects)}
                </div>
                <div className="modalFooter">
                    <button onClick={this._deleteUser}>Delete</button>
                    <button onClick={this._dismissModal}>Close</button>
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