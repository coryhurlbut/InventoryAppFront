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
            isOpen          : props.isOpen,
            isError         : false,
            errorMessage    : ''
        };
    }
    
    _dismissModal = () => {
        this.setState({ isOpen: false });
    }

    _logout = async () => {
        await loginLogoutController.logout(this.props.accountAuth)
        .then(() => {
            this.props.clearAuth();
            this.setState({ 
                isError: false, 
                errorMessage: ''
            });
            window.location.reload();
            this._dismissModal();
        })
        .catch(async (err) => {            
            this.setState({ 
                isError: true, 
                errorMessage: err.message
            }); 
        });
    }

    //Display Attempt errors if unsucessfully login
    _renderErrorMessage = () => {
        return (
            <label className="errorMessage">
                *{this.state.errorMessage}
            </label>
        );
    }

    render() {
        return(
            <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                <div className="modalHeader">
                    <h3>Log Out</h3>
                </div>
                <div className="modalBody">
                    {this.state.isError ?
                        this._renderErrorMessage() :
                        null
                    }
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