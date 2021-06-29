import React from 'react';
import {Link} from 'react-router-dom';
import AuthController from '../controllers/AuthController';

/*
*   Displays link to the login modal in app header
*/
export default class LoginLogout extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            loginLogoutIsVisible: props.loginLogoutIsVisible,
            text: 'Log In',
            auth: null
        };

        this.handleLoginLogout = this.handleLoginLogout.bind(this);

    };

    async handleLoginLogout() {
        if (this.state.text === 'Log In') {
            this.setState({text: 'Log Out'});
        } else if (this.state.text === 'Log Out') {
            this.setState({text: 'Log In'});
        };  
    };
    
    render() {
        if (this.state.loginLogoutIsVisible) {
            return(
                // <button onClick={this.handleLoginLogout}>
                //     {this.state.text}
                // </button>
                <Link to='/login'>Log In</Link>
            );
        } else {
            return null
        };
    };
};