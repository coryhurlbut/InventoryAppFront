import React from 'react';
import {Modal} from '@fluentui/react';
import itemController from '../../controllers/ItemController';
import userController from '../../controllers/UserController';

/*
*   Modal for signing out an item
*/
export default class SignItemOutModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen: props.isOpen,
            id: props.id,
            item: null,
            idArray: props.idArray,
            usersList: [],
            users: []
        };

        this.dismissModal = this.dismissModal.bind(this);
        this.signItemsOut = this.signItemsOut.bind(this);
    };

    async componentDidMount(){
        let users = await userController.getAllUsers();
        this.setState({ users: users });
        let usersL = [];
        this.state.users.map((users) => {
            usersL.push(users.userName);
        })
        console.log('user' + usersL);
        this.setState({ usersList: usersL });
    }

    async signItemsOut(){
        await itemController.signItemOut(this.state.idArray);
        window.location.reload(false);
        this.dismissModal();
    };

    dismissModal() {
        this.setState({isOpen: false});
    };

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className='modalHeader'>
                    <h3>Sign Item Out</h3>                    
                </div>
                <form>
                <div className='modalBody'>
                    
                    <h4>You are about to sign out: </h4>
                    <p>{this.state.idArray}</p>
                    <label for='users'>Choose a user: </label>
                    <select name='users' id='users' defaultValue='' required>
                    <option label='' hidden disabled selected></option>
                        {this.state.usersList.map(user => ( 
                        <option key={user} value={user}>
                            {user}
                        </option>))}
                        
                    </select>
                </div>
                <div className='modalFooter'>
                    <input type='submit'></input>
                    <button onClick={this.dismissModal}>Close</button>
                </div>
                </form>
            </Modal>
        );
    };
};