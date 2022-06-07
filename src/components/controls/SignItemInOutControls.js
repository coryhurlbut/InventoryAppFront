import React from 'react';

import { SignItemInModal, SignItemOutModal } from '../itemModals';

/*
*   Displays the button to sign an item in or out. Dependent on data displayed in the table.
*/
export default class SignItemInOutControls extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            modal           : null,
            selectedIds     : props.selectedIds,
            selectedObjects : props.selectedObjects
        };
    }

    //handles passed in props telling the sign in/out which items were selected
    componentDidUpdate(prevProps, prevState){
        if(prevProps !== this.props) {
            this.setState({
                selectedIds     : this.props.selectedIds,
                selectedObjects : this.props.selectedObjects
            });
        };
    }

    //we set modal to null to avoid soft crashing the page
    hideModal = () => {
        this.setState({ modal: null });
    }

    /**
     * Two functions to handle which modal to render
     */
    _signItemIn = () => {
        this.setState({
            modal: <SignItemInModal 
                isOpen
                hideModal={this.hideModal}
                selectedIds={this.state.selectedIds} 
                selectedObjects={this.state.selectedObjects} 
            />
        });
    }

    _signItemOut = () => {
        this.setState({
            modal: <SignItemOutModal 
                isOpen 
                hideModal={this.hideModal}
                selectedIds={this.state.selectedIds} 
                selectedObjects={this.state.selectedObjects}  
            />
        });
    }

    //if no errors, renders the button dependent on which table view is present, and doesnt render anything if items arent
    //whats being viewed. also utilizes ternery operators to configure buttons for selected items
    _buildButton = () => {
        if(this.props.inOrOut === 'Sign Item In') {
            return (
                <button 
                    onClick={this._signItemIn} 
                    disabled={this.state.selectedIds === undefined || this.state.selectedIds.length < 1}
                >
                    {this.props.inOrOut}
                </button>
            );
        } else if(this.props.inOrOut === 'Sign Item Out') {
            return (
                <button 
                    onClick={this._signItemOut} 
                    disabled={this.state.selectedIds === undefined || this.state.selectedIds.length < 1}
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