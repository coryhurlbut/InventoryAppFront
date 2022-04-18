import React                        from 'react';

import { Modal }                    from '@fluentui/react';

import { loginLogoutController }    from '../../controllers';

/*
*   Modal for logging out
*/
export default class LogoutModal extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            isOpen: props.isOpen,
        };
    }

    _logout = async () => {
        //TODO: Error handling
        await loginLogoutController.logout(this.props.accountAuth).then(() => this.props.clearAuth());
        window.location.reload();
        this._dismissModal();
    }

    _dismissModal = () => {
        this.setState({ isOpen: false });
    }

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className="modalHeader">
                    <h3>Log Out</h3>
                </div>
                <div className="modalBody">
                    <p>Are you sure you want to Log Out?</p>
                </div>
                <div className="modalFooter">
                    <button onClick={this._logout}>Log Out</button>
                    <button onClick={this._dismissModal}>Close</button>
                </div>
            </Modal>
        );
    }
}