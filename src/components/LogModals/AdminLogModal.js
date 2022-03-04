import React                    from 'react';
import { Modal }                from '@fluentui/react';
import { AdminLogController }   from '../../controllers';
import '../../styles/Modal.css'
import adminLogController from '../../controllers/AdminLogController';
import Table from '/home/williamglass/inventory-app-front-end/src/components/Table.js';


const columns = 
         [
                {
                    Header: '.',
                    columns: [
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
    
                ]}
                
            ]
/*
*   Displays log of admin actions (add, edit, delete of items and users)
*/
export default class AdminLogDisplay extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            isOpen: props.isOpen,
            content: [],
            modal: null,
        };
    };

    async componentDidMount() {
        // try {
        //     let logs = await AdminLogController.getAllAdminLogs();
        //     console.log(logs);
        //     this.setState({ content: logs });
            
        // } catch (error) {
        //     console.log(error)
        // };
        let logs = await adminLogController.getAllAdminLogs();
        this.setState({ content: logs });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props !== prevProps) {
            this.setState({
                isOpen: this.props.isOpen
            });
        };
    };

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