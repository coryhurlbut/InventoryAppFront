import React from 'react';
import '@fluentui/react';
import '../styles/App.css';
import {authController}         from '../controllers/AuthController';
import {loginLogoutController}  from '../controllers/LoginLogoutController';
import ContentList              from './ContentList';
import ItemLogDisplay           from './ItemLogDisplay';
import AdminLogDisplay          from './AdminLogDisplay';
import LoginModal               from './LoginModal';
import LogoutModal              from './LogoutModal';

//Settings for what is to be displayed based on the user's role
const displayPresets = {
    main: {
        userContentIsVisible:   false,
        signItemInOutIsVisible: false,
        editControlIsVisible:   false,
        allowEditNotes:         false,
        isLoggedIn:             false,
        itemLogIsVisible:       false,
        adminLogIsVisible:      false
    },
    custodian: {
        userContentIsVisible:   false,
        signItemInOutIsVisible: true,
        editControlIsVisible:   false,
        allowEditNotes:         false,
        isLoggedIn:             true,
        itemLogIsVisible:       true,
        adminLogIsVisible:      false
    },
    admin: {
        userContentIsVisible:   true,
        signItemInOutIsVisible: true,
        editControlIsVisible:   true,
        allowEditNotes:         true,
        isLoggedIn:             true,
        itemLogIsVisible:       true,
        adminLogIsVisible:      true
    }
};

/*
*   Builds the page by calling components and passing down what should be visible
*/
export default class ContentBuilder extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            auth:           null,
            view:           displayPresets.main,
            isLoggedIn:     false,
            modal:          null
        };

        this.setAuth        = this.setAuth.bind(this);
        this.hideModal      = this.hideModal.bind(this);
        this.loginLogout    = this.loginLogout.bind(this);
        this.buildContent   = this.buildContent.bind(this);
        this.clearAuth      = this.clearAuth.bind(this);
    };

    async componentDidMount() {
        //Move this to controller
        const refreshToken = await authController.getRefreshToken();
        console.log(refreshToken)
        if (refreshToken !== null) {
            let auth = await authController.refreshToken(refreshToken)
            console.log(auth)
            this.setAuth(auth);
        }
    };

    setAuth(auth) {
        this.setState({auth: auth, isLoggedIn: true, view: displayPresets[auth.user.userRole] || displayPresets.main});
    };

    clearAuth() {
        this.setState({auth: null, isLoggedIn: false, view: displayPresets.main});
    };

    hideModal() {
        this.setState({modal: null});
    };

    loginLogout() {
        if (this.state.isLoggedIn) {
            this.setState({modal: <LogoutModal auth={this.state.auth} isOpen={true} hideModal={this.hideModal} clearAuth={this.clearAuth}/>});
        } else {
            this.setState({modal: <LoginModal isOpen={true} hideModal={this.hideModal} setAuth={this.setAuth}/>});
        };
    };

    buildContent(view) {
        return (
            <div>
                {this.state.modal}
                <div className="header">
                     Inventory App
                     <button className='logInLogOut' onClick={this.loginLogout}>
                         {this.state.isLoggedIn ? 'Log Out': 'Log In'}
                     </button>
                </div>
                <div className="body">
                    <ContentList 
                        editControlIsVisible={view.editControlIsVisible} 
                        userContentIsVisible={view.userContentIsVisible} 
                        signItemInOutIsVisible={view.signItemInOutIsVisible}
                    />
                    <ItemLogDisplay itemLogIsVisible={view.itemLogIsVisible} />
                    <AdminLogDisplay adminLogIsVisible={view.adminLogIsVisible} />   
                </div>
            </div>
        );
    };

    render () {
        return(this.buildContent(this.state.view));
    };
};