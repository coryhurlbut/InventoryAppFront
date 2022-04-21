import React                    from 'react';

import { Modal }                from '@fluentui/react';

import {Table}                    from '../tableStuff';
import { itemLogController }    from '../../controllers';

const columns = [
    {
        Header: 'ID',
        accessor: '_id',
    },
    {
        Header: 'Item ID',
        accessor: 'itemId',
    },
    {
        Header: 'Custodian ID',
        accessor: 'custodianId',
    },
    {
        Header: 'Action taken',
        accessor: 'action',
    },
    {
        Header: 'Notes',
        accessor: 'notes'
    },
    {
        Header: 'Date',
        accessor: 'date'
    }   
];

/*
*   Displays log of items signed in and out
*/

export default class ItemLogModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: props.isOpen,
            content: [],

            isControllerError:      false,
            controllerErrorMessage: ''
        };
    }

    async componentDidMount() {
        let logData = await itemLogController.getAllItemLogs()
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
        this.setState({isOpen: false});
    }

    _renderItemLog = () => {
        return(
            <>
                <div className="modalHeader">Item Log</div>
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
        return (
            <Modal onDismissed={this.props.hideModal} isOpen={this.state.isOpen}>
                { this.state.isControllerError ? this._renderErrorDisplay() : this._renderItemLog() }
            </Modal>
        ); 
    }
}