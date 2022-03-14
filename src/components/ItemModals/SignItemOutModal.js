import React                from 'react';
import { Modal }            from '@fluentui/react';
import { ItemController, 
        ItemLogController,
        UserController }    from '../../controllers';

/*
*   Modal for signing out an item
*/
export default class SignItemOutModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:        props.isOpen,
            idArray:       props.idArray,
            selectedObjects: props.selectedObjects,
            users:         [],
            selection:     '',

            isControllerError:      false,
            controllerErrorMessage: ''
        };
    };

    async componentDidMount(){
        try {
            let users = await UserController.getAllActiveUsers();
            this.setState({ users: users });
            this.assignOptionGroup();
        } catch (error) {
            //If user trys interacting with the modal before everything can properly load
            //TODO: loading page icon instead of this
            this.setState({ isControllerError: true,
                            controllerErrorMessage: "An error occured while loading. Please refresh and try again."});
        }
    };

    dismissModal() {
        this.setState({ isOpen: false });
    };

    async signItemsOut(){
        await ItemController.signItemOut(this.state.idArray, this.state.selection)
        .then( async (auth) => {
            if(auth.status !== undefined && auth.status >= 400) throw auth;
            this.setState({ controllerErrorMessage: '', isControllerError: false });

            for (let i = 0; i < this.state.idArray.length; i++) {
                let info = {
                    itemId:      this.state.idArray[i],
                    userId:      this.state.selection,
                    custodianId: '',
                    action:      'signed out',
                    notes:       'test'
                };
                await ItemLogController.createItemLog(info);
            };

            window.location.reload();
            this.dismissModal();
        })
        .catch((error) => {            
            //If user trys interacting with the modal before everything can properly load
            //TODO: loading page icon instead of this
            this.setState({ isControllerError: true,
                controllerErrorMessage: error.message });
        });
        
    };

    //method that dynamically generates child option tags to grp option tags in the render 
    assignOptionGroup() {
        for (let i = 0; i < this.state.users.length; i++) {
            let option = document.createElement("option");
                option.append(this.state.users[i].userName);
                option.key = this.state.users[i]._id;
            if (this.state.users[i].userRole === 'user') {
                document.getElementById('userGroup').append(option);
            } else if (this.state.users[i].userRole === 'admin') {
                document.getElementById('adminGroup').append(option);
            } else if (this.state.users[i].userRole === 'custodian') {
                document.getElementById('custodianGroup').append(option);
            }
        }
    };

    /* Loops through the array of items and displays them as a list */
    displayArray(items){
        const displayItems = items.map(
            (item) => <li key={ item._id } > { item.name } </li>);

        return(
            <ul> { displayItems } </ul>
        );
    };

    /* Useability Feature:
        submit button is only enabled when no errors are detected */
    isSumbitAvailable(){
        if(this.state.selection){
            return true;
        }
        return false;
    };

    /* Builds display for deleting items */
    buildSignOutNotification(){
        return(
            <>
            <div className='modalHeader'>
                <h3>Sign Item Out</h3>                    
            </div>
            <form onSubmit={(event) => {event.preventDefault(); this.signItemsOut();}}>
            <div className='modalBody'>
                <h4>You are about to sign out: </h4>
                {this.displayArray(this.state.selectedObjects)}
                <label>Choose a user: </label>
                <select name='usersS' id='usersS' defaultValue={''} 
                onChange={(event) => this.setState({ selection: event.target.key})}>
                    <option label='' hidden disabled ></option>
                    <optgroup label='Users' id='userGroup'></optgroup>
                    <optgroup label='Custodians' id='custodianGroup'></optgroup>
                    <optgroup label='Admins' id='adminGroup'></optgroup>
                </select>
            </div>
            <div className='modalFooter'>
                { this.isSumbitAvailable() ? <input type='submit'></input> : <input type='submit' disabled></input>}
                <button type="reset" onClick={() => this.dismissModal()}>Close</button>
            </div>
            </form>
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
                { this.state.isControllerError ? this.buildErrorDisplay() : this.buildSignOutNotification() }
            </Modal>
        );
    }
}