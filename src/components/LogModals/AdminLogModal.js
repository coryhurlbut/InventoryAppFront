import React                    from 'react';
import { Modal }                from '@fluentui/react';
import { AdminLogController }   from '../../controllers';
import '../../styles/Modal.css'

/*
*   Displays log of admin actions (add, edit, delete of items and users)
*/
export default class AdminLogDisplay extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            isOpen: props.isOpen,
            content: ''
        };
    };

    async componentDidMount() {
        try {
            let logs = await AdminLogController.getAllAdminLogs();
            this.setState({ content: logs });
        } catch (error) {
            console.log(error)
        };
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
            <Modal  isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className="modalHeader">
                    Admin Logs
                </div>
                <div className="modalBody">
                    {this.state.content}
                    This feature is still being developed.
                </div>
                <div className="modalFooter">
                    <button  onClick={() => this.dismissModal()}>Close</button>
                </div>
            </Modal>
        )
    };
};