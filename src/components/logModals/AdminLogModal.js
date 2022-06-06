import React                    from 'react';

import { Modal }                from '@fluentui/react';

import { adminLogColumns }      from '../contentPresets';
import { adminLogController }   from '../../controllers';
import {Table}                  from '../tableStuff';

import '../../styles/Modal.css'


/*
*   Displays log of admin actions (add, edit, delete of items and users)
*/
const MODAL_HEADER_TITLE = 'Admin Log';
const MODAL_HEADER_ERROR_TITLE = 'Error Has Occured';

const BTN_CLOSE = 'Close';

export default class AdminLogModal extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            isOpen                  : props.isOpen,
            content                 : [],
            isControllerError       : false,
            controllerErrorMessage  : '',
            isError                 : false,
            errorMessage            : ''
        };
    }
    //grabs all admin logs from database
    async componentDidMount() {
        try {
            let logData = await adminLogController.getAllAdminLogs();
            this.setState({ content: logData });
        } catch (error) {
            this.setState({ 
                isControllerError: true, 
                controllerErrorMessage: error.message
            }); 
        }
    }

    _dismissModal = () => {
        this.setState({ isOpen: false });
    }
    //successful database fetch + no errors
    _renderAdminLog = () => {
        return(
            <>
                <div className="modalHeader">{MODAL_HEADER_TITLE}</div>
                <div className="modalBody">
                    {this.state.isError ?
                        this._renderErrorMessage() :
                        null
                    }
                    <Table columns={adminLogColumns} data={this.state.content} />
                </div>
                <div className="modalFooter">
                    <button onClick={this._dismissModal}>{BTN_CLOSE}</button>
                </div>
            </>
        );
    }

    //Display Attempt errors if unsucessfully login
    _renderErrorMessage = () => {
        return (
            <label className="errorMessage">
                *{this.state.errorMessage}
            </label>
        );
    }

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
    
    render() {
        return(
            <Modal onDismissed={this.props.hideModal} isOpen={this.state.isOpen}>
                { this.state.isControllerError ? this._renderErrorDisplay() : this._renderAdminLog() }
            </Modal>
        );
    }
}