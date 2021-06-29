import React from 'react';
import '@fluentui/react';
import {SignItemInModal, SignItemOutModal} from './ItemModals';

/*
*   Displays the button to sign an item in or out. Dependent on data displayed in the table.
*/
export default class SignItemInOutControls extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            signItemInOutIsVisible: props.signItemInOutIsVisible,
            modal: null
        };

        this.hideModal = this.hideModal.bind(this);
        this.signItemIn = this.signItemIn.bind(this);
        this.signItemOut = this.signItemOut.bind(this);
        this.buildSignItemIn = this.buildSignItemIn.bind(this);
        this.buildSignItemOut = this.buildSignItemOut.bind(this);
        this.buildButton = this.buildButton.bind(this);

    };

    hideModal() {
        console.log('hideModal')

        this.setState({modal: null});
    };

    signItemIn() {
        console.log('signItemIn')

        this.setState({modal: <SignItemInModal isOpen={true} hideModal={this.hideModal}/>})
    };

    signItemOut() {
        console.log('signItemOut')

        this.setState({modal: <SignItemOutModal isOpen={true} hideModal={this.hideModal}/>})
    };

    buildSignItemIn() {
        console.log('buildSignItemIn')

        return(
            <button onClick={this.signItemIn}>{this.props.inOrOut}</button>
        );
    };

    buildSignItemOut() {
        console.log('buildSignItemOut')

        return(
            <button onClick={this.signItemOut}>{this.props.inOrOut}</button>
        );
    };

    buildButton() {
        console.log('buildButton')
        if (this.props.inOrOut == 'Sign Item In') {
            return this.buildSignItemIn();
        } else if (this.props.inOrOut == 'Sign Item Out') {
            return this.buildSignItemOut();
        } else {
            return null;
        };
    };

    render() {
        return(
            <div>
                {this.state.modal}
                {this.state.signItemInOutIsVisible ? this.buildButton(): null}
            </div>
            
            
        )
    };
};