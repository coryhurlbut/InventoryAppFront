import React                    from 'react';

import { Modal }                from '@fluentui/react';


import { adminLogController }   from '../../controllers';
import {Table}                  from '../tableStuff';

import '../../styles/Modal.css'


const columns = [
    {
        Header: 'Item ID',
        accessor: 'itemId',
    },
    {
        Header: 'User ID',
        accessor: 'userId',
    },
    {
        Header: 'Admin ID',
        accessor: 'adminId'
    },
    {
        Header: 'Action taken',
        accessor: 'action',
    },
    {
        Header: 'Content',
        accessor: 'content'
    },
    {
        Header: 'Date',
        accessor: 'date'
    }
];

/*
*   Displays log of admin actions (add, edit, delete of items and users)
*/
export default class AdminLogModal extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            isOpen: props.isOpen,
            content: [],

            isControllerError:      false,
            controllerErrorMessage: ''
        };
    }

    async componentDidMount() {
        let logData = await adminLogController.getAllAdminLogs()
        .then(() => {
            this.setState({ content: logData });
        })
        .catch(async (err) => {            
            this.setState({ 
                isControllerError: true, 
                controllerErrorMessage: err.message
            }); 
        });
    }

    _dismissModal = () => {
        this.setState({ isOpen: false });
    }

    _renderAdminLog = () => {
        return(
            <>
                <div className="modalHeader">Admin Log</div>
                <div className="modalBody">
                    {this.state.isControllerError ?
                        this._renderErrorMessage() :
                        null
                    }
                    <Table columns={columns} data={this.state.content} />
                </div>
                <div className="modalFooter">
                    <button onClick={this._dismissModal}>Close</button>
                </div>
            </>
        );
    }

    //Display Attempt errors if unsucessfully login
    _renderErrorMessage = () => {
        return (
            <label className="errorMessage">
                *{this.state.controllerErrorMessage}
            </label>
        );
    }

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
    
    render() {
        return(
            <Modal onDismissed={this.props.hideModal} isOpen={this.state.isOpen}>
                { this.state.isControllerError ? this._renderErrorDisplay() : this._renderAdminLog() }
            </Modal>
        );
    }
}