import React          from 'react';
import { Modal }      from '@fluentui/react';
import userController from '../../controllers/UserController';
import Table          from '../Table';
import '../../styles/Modal.css'

const columns = [
    {
        Header: 'First Name',
        accessor: 'firstName',
    },{
        Header: 'Last Name',
        accessor: 'lastName',
    },{
        Header: 'Username',
        accessor: 'userName'
    },{
        Header: 'Phone Number',
        accessor: 'phoneNumber',
    }

]

export default class ApproveUsersModal extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            isOpen: props.isOpen,
            content: [],
            hideModal: props.hideModal,
            role:   props.role,
            contentType: props.contentType,
            idArray: [],
            selectedObjects: [],
            btnConfig: true
        }
        this.setParentState    = this.setParentState.bind(this);

    }
    async componentDidMount(){
        let users = await userController.getPendingUsers();
        this.setState({ content: users });
        
    }
    dismissModal(){
        this.setState({ isOpen: false });
        window.location.reload();
    }
    async _approveUsers(){
        await userController.activateUsers(this.state.idArray);
        this.dismissModal();
    }
    async _denyUsers(){
        await userController.deleteUsers(this.state.idArray);
        this.dismissModal();
    }

    setParentState = (user) => {
        let arr = this.state.idArray;
        let objArr = this.state.selectedObjects;
        
        if(arr.includes(user.userName)) {
            arr = arr.filter(el => el !== user.userName);
            objArr = objArr.filter(object => object.userName !== user.userName);
        } else {
            arr.push(user.userName);
            objArr.push(user);
        };

        this.setState({idArray: arr, selectedObjects: objArr});
    }

    render(){
        return(
            <Modal onDismissed={this.props.hideModal} isOpen={this.state.isOpen}>
                <div className="modalHeader">Pending Users</div>
                <form onSubmit={(Event) => {Event.preventDefault()}}>
                <div className='modalBody'>
                    {this.state.content.length >= 1 ? 
                    <Table
                        columns={columns} 
                        data={this.state.content} 
                        userRole={this.state.role} 
                        contentType={this.state.contentType}
                        setParentState={this.setParentState}
                    />
                    : <p>There is no pending Users</p>}
                </div>
                <div className="modalFooter">
                    <button disabled={this.state.idArray.length > 0 ? false : true} onClick={() => this._approveUsers()}>Approve</button>
                    <button disabled={this.state.idArray.length > 0 ? false : true} onClick={() => this._denyUsers()}>Deny</button>
                    <button onClick={() => {this.setState({ isOpen: false })}}>Close</button> 
                </div>
                </form>

            </Modal>
        )
        
    }
}
