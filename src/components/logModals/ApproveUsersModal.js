import React          from 'react';

import { Modal }      from '@fluentui/react';

import userController from '../../controllers/UserController';
import {Table}        from '../tableStuff';
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

export default class ApproveUsersModal extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            isOpen:          props.isOpen,
            content:         [],
            hideModal:       props.hideModal,
            accountRole:     props.accountRole,
            contentType:     props.contentType,
            selectedObjects: [],
            selectedIds:     [],
            btnConfig:       true,

            isControllerError:      false,
            controllerErrorMessage: '',
            isError:                false,
            errorMessage:           ''
        }
        this.setParentState    = this._setParentState.bind(this);
    }

    async componentDidMount() {
        try {
            let users = await userController.getPendingUsers();
            this.setState({ content: users });
        } catch (error) {
            this.setState({ 
                isControllerError: true, 
                controllerErrorMessage: error.message
            }); 
        }
    }

    _dismissModal = () => {
        this.setState({ isOpen: false });
        window.location.reload();
    }

    _approveUsers = async () =>{
        await userController.activateUsers(this.state.selectedIds)
        .then(() => {
            this._dismissModal();
        })
        .catch(async (err) => {            
            this.setState({ 
                isError: true, 
                errorMessage: err.message
            }); 
        });
    }

    _denyUsers = async () => {
        await userController.deleteUsers(this.state.selectedIds)
        .then(() => {
            this._dismissModal();
        })
        .catch(async (err) => {            
            this.setState({ 
                isError: true, 
                errorMessage: err.message
            }); 
        });
    }

    _setParentState = (user) => {
        let arr = this.state.selectedIds;
        let objArr = this.state.selectedObjects;
        
        if(arr.includes(user.userName)) {
            arr = arr.filter(el => el !== user.userName);
            objArr = objArr.filter(object => object.userName !== user.userName);
        } else {
            arr.push(user.userName);
            objArr.push(user);
        };

        this.setState({ selectedIds: arr,
            selectedObjects: objArr
        });
    }

    _renderForm = () => {
        return(
            <>
                <div className="modalHeader">Pending Users</div>
                <form onSubmit={(Event) => {Event.preventDefault()}}>
                    <div className='modalBody'>
                        {this.state.isError ?
                            this._renderErrorMessage() :
                            null
                        }
                        {this.state.content.length >= 1 ? 
                        <Table
                            columns={columns} 
                            data={this.state.content} 
                            userRole={this.state.accountRole} 
                            contentType={this.state.contentType}
                            setParentState={this.setParentState}
                        />
                        : <p>There is no pending Users</p>}
                    </div>
                    <div className="modalFooter">
                        <button 
                            disabled={this.state.selectedIds.length > 0 ? false : true} 
                            onClick={() => this._approveUsers()}
                        >
                            Approve
                        </button>
                        <button 
                            disabled={this.state.selectedIds.length > 0 ? false : true} 
                            onClick={() => this._denyUsers()}
                        >
                            Deny
                        </button>
                        <button 
                            onClick={() => {this.setState({ isOpen: false })}}
                        >
                            Close
                        </button> 
                    </div>
                </form>
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

    /* If componentDidMount error, display message to user */
    _renderErrorDisplay = () => {
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

    render(){
        return(
            <Modal onDismissed={this.props.hideModal} isOpen={this.state.isOpen}>
                { this.state.isControllerError ? this._renderErrorDisplay() : this._renderForm() }
            </Modal>
        )
    }
}
