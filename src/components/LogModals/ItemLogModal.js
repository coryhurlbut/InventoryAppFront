import React                from 'react';
import { Modal }              from '@fluentui/react';
import Table                from '../Table';
import itemLogController    from '../../controllers/ItemLogController';
import '@fluentui/react';
<<<<<<< HEAD
import Table from '../Table';
import itemLogController from '../../controllers/ItemLogController';
// import ItemLogController from '../controllers/ItemLogController';
=======
>>>>>>> 35887e0a8a6b110b27da7281b3df7ec8f622b5c7

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
    constructor(props){
        super(props);

        this.state = {
            isOpen: props.isOpen,
            content: []
        };
    }

    async componentDidMount(){
        let data = await itemLogController.getAllItemLogs();
        this.setState({ content: data });
    }

    dismissModal(){
        this.setState({isOpen: false});
    }

    render() {
        return (
            <Modal onDismissed={this.props.hideModal} isOpen={this.state.isOpen}>
                <div className='modalHeader'>Item Log</div>
                <div className='modalBody'>
                    <Table columns={columns} data={this.state.content} />
                </div>
                <div className='modalFooter'>
                    <button onClick={() => this.dismissModal()}>Close</button>
                </div>
            </Modal>
        ); 
    };
};