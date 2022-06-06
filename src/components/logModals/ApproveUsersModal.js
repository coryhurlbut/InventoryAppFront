import React                  from 'react';

import { Modal }              from '@fluentui/react';

import { approveUserColumns } from '../contentPresets';
import userController         from '../../controllers/UserController';
import {Table}                from '../tableStuff';
import '../../styles/Modal.css'

/*
 * A modal for the logged in admin to view all non-users who requested account through home page
    requests are viewed from the top right dropdown via the Pending button
 */
const MODAL_HEADER_TITLE = 'Pending Users';
const MODAL_HEADER_ERROR_TITLE = 'Error Has Occured';

const NO_CONTENT = 'No available Pending Users';

const BTN_APPROVE = 'Approve';
const BTN_DENY = 'Deny';
const BTN_CLOSE = 'Close';

export default class ApproveUsersModal extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            isOpen                  : props.isOpen,
            content                 : [],
            hideModal               : props.hideModal,
            accountRole             : props.accountRole,
            contentType             : props.contentType,
            selectedObjects         : [],
            selectedIds             : [],
            btnConfig               : true,
            isControllerError       : false,
            controllerErrorMessage  : '',
            isError                 : false,
            errorMessage            : ''
        }
        this.setParentState    = this._setParentState.bind(this);
    }
    //grabs all users from user table where status equals pending
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

    //database call to update selected user's status to 'active', thus making them a legit user, and will 
    //now show up on tables in app
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

    //simply delete requesting users from table in database
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

    //function to set state of selected items 
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
                <div className="modalHeader">
                    <h3>{MODAL_HEADER_TITLE}</h3> 
                </div>
                <form onSubmit={(Event) => {Event.preventDefault()}}>
                    <div className='modalBody'>
                        {this.state.isError ?
                            this._renderErrorMessage() :
                            null
                        }
                        {this.state.content.length >= 1 ? 
                            <Table
                                columns={approveUserColumns} 
                                data={this.state.content} 
                                userRole={this.state.accountRole} 
                                contentType={this.state.contentType}
                                setParentState={this.setParentState}
                            />
                            : <p className='centerText'>{NO_CONTENT}</p>
                        }
                    </div>
                    <div className="modalFooter">
                        <button 
                            disabled={this.state.selectedIds.length > 0 ? false : true} 
                            onClick={() => this._approveUsers()}
                        >
                            {BTN_APPROVE}
                        </button>
                        <button 
                            disabled={this.state.selectedIds.length > 0 ? false : true} 
                            onClick={() => this._denyUsers()}
                        >
                            {BTN_DENY}
                        </button>
                        <button 
                            onClick={() => {this.setState({ isOpen: false })}}
                        >
                            {BTN_CLOSE}
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
                    <h3>{MODAL_HEADER_ERROR_TITLE}</h3>
                </div>
                <div className="modalBody">
                    <p className="errorMesage">
                        {this.state.controllerErrorMessage}
                    </p>
                </div>
                <div className="modalFooter">
                    <button type="reset" onClick={this._dismissModal}>{BTN_CLOSE}</button>
                </div>
            </>
        );
    }

    render(){
        return(
            <Modal onDismissed={this.props.hideModal} isOpen={this.state.isOpen}>
                {this.state.isControllerError ? 
                    this._renderErrorDisplay() : 
                    this._renderForm() 
                }
            </Modal>
        )
    }
}