import React from 'react';
import {Modal} from '@fluentui/react';
import '@fluentui/react';
import Table from '/home/williamglass/inventory-app-front-end/src/components/Table.js';
import itemLogController from '../../controllers/ItemLogController';
// import ItemLogController from '../controllers/ItemLogController';

const columns = 
         [
                {
                    Header: '.',
                    columns: [
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
    
                ]}
                
            ]

/*
*   Displays log of items signed in and out
*/

export default class ItemLogModal extends React.Component {
    constructor(props){
        super(props);
        //ToDo: Build out CustodianLog functionality
        this.state = {
            isOpen: props.isOpen,
            modal: null,
            itemLogIsVisible: props.itemLogIsVisible,
            content: []
        }
    }
    
    

    componentDidUpdate(prevProps, prevState) {
        if (this.props.itemLogIsVisible !== prevProps.itemLogIsVisible) {
            this.setState({
                itemLogIsVisible: this.props.itemLogIsVisible
            });
        };
        
    }
    async componentDidMount(){
        let data = await itemLogController.getAllItemLogs();
        this.setState({ content: data });
        console.log(this.state.content);
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