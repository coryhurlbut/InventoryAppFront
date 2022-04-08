import React                    from 'react';

import { Modal }                from '@fluentui/react';

import Table                    from '../Table';
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
            content: []
        };
    }

    async componentDidMount() {
        let data = await itemLogController.getAllItemLogs();
        this.setState({ content: data });
    }

    _dismissModal = () => {
        this.setState({isOpen: false});
    }

    render() {
        return (
            <Modal onDismissed={this.props.hideModal} isOpen={this.state.isOpen}>
                <div className="modalHeader">Item Log</div>
                <div className="modalBody">
                    <Table columns={columns} data={this.state.content} />
                </div>
                <div className="modalFooter">
                    <button onClick={this._dismissModal}>Close</button>
                </div>
            </Modal>
        ); 
    }
}