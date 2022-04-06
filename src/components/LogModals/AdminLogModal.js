import React                    from 'react';
import { Modal }                from '@fluentui/react';
import '../../Styles/Modal.css'
import adminLogController from '../../Controllers/AdminLogController';
import Table from '../Table';


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
export default class AdminLogDisplay extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            isOpen: props.isOpen,
            content: []
        };
    };

    async componentDidMount() {
        let logs = await adminLogController.getAllAdminLogs();
        this.setState({ content: logs });
    }

    dismissModal() {
        this.setState({ isOpen: false });
    }
    
    render() {
        return(
            <Modal onDismissed={this.props.hideModal} isOpen={this.state.isOpen}>
                <div className='modalHeader'>Admin Log</div>
                <div className='modalBody'>
                    <Table columns={columns} data={this.state.content} />
                </div>
                <div className='modalFooter'>
                    <button onClick={() => this.dismissModal()}>Close</button>
                </div>
            </Modal>
        )
    };
};