import React from 'react';

import { SignItemInModal, SignItemOutModal } from '../itemModals';

/*
*   Displays the button to sign an item in or out. Dependent on data displayed in the table.
*/
export default class SignItemInOutControls extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            modal:              null,
            idArray:            props.idArray,
            selectedObjects:    props.selectedObjects
        };
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps !== this.props) {
            this.setState({
                idArray:            this.props.idArray,
                selectedObjects:    this.props.selectedObjects
            });
        };
    }

    hideModal = () => {
        this.setState({ modal: null });
    }

    _signItemIn = () => {
        this.setState({
            modal: <SignItemInModal 
                isOpen
                hideModal={this.hideModal}
                idArray={this.state.idArray} 
                selectedObjects={this.state.selectedObjects} 
            />
        });
    }

    _signItemOut = () => {
        this.setState({
            modal: <SignItemOutModal 
                isOpen 
                hideModal={this.hideModal}
                idArray={this.state.idArray} 
                selectedObjects={this.state.selectedObjects}  
            />
        });
    }

    _buildButton = () => {
        if(this.props.inOrOut === 'Sign Item In') {
            return (
                <button 
                    onClick={this._signItemIn} 
                    disabled={this.state.idArray.length > 0 ? false : true}
                >
                    {this.props.inOrOut}
                </button>
            );
        } else if(this.props.inOrOut === 'Sign Item Out') {
            return (
                <button 
                    onClick={this._signItemOut} 
                    disabled={this.state.idArray.length > 0 ? false : true}
                >
                    {this.props.inOrOut}
                </button>
            );
        } else {
            return null;
        };
    }

    render() {
        return(
            <>
                {this.state.modal}
                {this._buildButton()}
            </>
        );
    }
}