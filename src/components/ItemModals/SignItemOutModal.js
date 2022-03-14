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
            item:          null,
            idArray:       props.idArray,
            selectedObjects: props.selectedObjects,
            users:         [],
            selection:     null,
            userSelected:  {}
        };
    };

    async componentDidMount(){
        let users = await UserController.getAllActiveUsers();
        this.setState({ users: users });
        this.assignOptionGroup();
    };

    dismissModal() {
        this.setState({ isOpen: false });
    };

    async signItemsOut(){
        for(var i = 0; i < this.state.users.length; i++){
            if(this.state.users[i].userName === this.state.selection){
                let user = this.state.users[i];
                await this.setState({ userSelected: user});
                break;
            }
        }

        await ItemController.signItemOut(this.state.idArray, this.state.selection)
        .then( async (auth) => {
            if(auth.status !== undefined && auth.status >= 400) throw auth;
            this.setState({ error: '', isError: false });

            for (let i = 0; i < this.state.idArray.length; i++) {
                let info = {
                    itemId:      this.state.idArray[i],
                    userId:      this.state.userSelected._id,
                    custodianId: '',
                    action:      'signed out',
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

    //method that dynamically generates child option tags to grp option tags in the render 
    assignOptionGroup() {
        for (let i = 0; i < this.state.users.length; i++) {
            let option = document.createElement("option");
                option.append(this.state.users[i].userName);
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

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className='modalHeader'>
                    <h3>Sign Item Out</h3>                    
                </div>
                <form onSubmit={(event) => {event.preventDefault(); this.signItemsOut();}}>
                <div className='modalBody'>
                    <h4>You are about to sign out: </h4>
                    {this.displayArray(this.state.selectedObjects)}
                    <label>Choose a user: </label>
                    <select name='usersS' id='usersS' defaultValue={''} 
                    onChange={(event) => this.setState({ selection: event.target.value})}>
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
            </Modal>
        );
    }
}