import React                from 'react';
import { Modal }            from '@fluentui/react';
import UserController       from '../../controllers/UserController';
import adminLogController   from '../../controllers/AdminLogController';

/*
*   Modal for deleting a user
*/
export default class DeleteUserModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:   props.isOpen,
            idArray:  props.idArray,
            error:    '',
            isError:  false
        };
    };

    dismissModal() {
        this.setState({ isOpen: false });
    };
    
    async deleteUser() {
        await UserController.deleteUsers(this.state.idArray)
        .then( async (auth) => {
            if(auth.status !== undefined && auth.status >= 400) throw auth;
            this.setState({ error: '', isError: false });

            for (let i = 0; i < this.state.idArray.length; i++) {
                let log = {
                    itemId:     'N/A',
                    userId:     this.state.idArray[i],
                    adminId:    '',
                    action:     'delete',
                    content:    'user'
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
    displayArray(idArray){
        const displayID = idArray.map(
            (idArray) => <li key={ idArray.toString() } > { idArray } </li>);

        return(
            <ul> { displayID } </ul>
        );
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className='modalHeader'>
                    <h3>Delete User</h3>
                </div>
                <div className='modalBody'>
                    {this.state.isError ? 
                        this.state.error :
                        <div>
                            <h4>You are about to delete the following:</h4>
                            {this.displayArray(this.state.idArray)}
                        </div>
                    }
                </div>
                <div className='modalFooter'>
                    {this.state.isError ? null : <button onClick={() => {this.deleteUser()}}>Delete</button>}
                    <button onClick={() => this.dismissModal()}>Close</button>
                </div>
            </Modal>
        );
    };
};