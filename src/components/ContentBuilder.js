import React from 'react';
import '@fluentui/react';
import '../styles/App.css';
import {authController}         from '../controllers/AuthController';
import ContentList              from './ContentList';
import ItemLogDisplay           from './LogModals/ItemLogDisplay';
import AdminLogModal            from './LogModals/AdminLogModal';
import LoginModal               from './ProfileModals/LoginModal';
import LogoutModal              from './ProfileModals/LogoutModal';

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
        userContentIsVisible:   true,
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
            modal:          null,
            err:            null,
            role:           null
        };

        this.error = null;

        this.setAuth        = this.setAuth.bind(this);
        this.hideModal      = this.hideModal.bind(this);
        this.loginLogout    = this.loginLogout.bind(this);
        this.buildContent   = this.buildContent.bind(this);
        this.clearAuth      = this.clearAuth.bind(this);
    };

    async componentDidMount() {
        let auth = await authController.checkToken();
        
        if (auth === undefined || auth.error !== undefined) {
            this.clearAuth();
        } else if (typeof auth === 'string' && auth.split(' ')[0] === 'TypeError:') {
            this.error = auth;
        } else {
            this.setAuth(auth);
        };
    };

    setAuth(auth) {
        if (auth.user.userRole === 'admin' || auth.user.userRole === 'custodian') {
            this.setState({auth: auth, isLoggedIn: true, view: displayPresets[auth.user.userRole]});
        } else {
            this.clearAuth();
            return;
        };
        this.setState({ role: auth.user.userRole });
    };

    clearAuth() {
        this.setState({auth: null, isLoggedIn: false, view: displayPresets.main});
    };

    hideModal() {
        this.setState({modal: null});
    };

    showAdminLogModal() {
        this.setState({ modal: <AdminLogModal isOpen={true} hideModal={this.hideModal}/>  })
    }

    loginLogout() {
        if (this.state.isLoggedIn) {
            this.setState({modal: <LogoutModal auth={this.state.auth} isOpen={true} hideModal={this.hideModal} clearAuth={this.clearAuth}/>});
        } else {
            this.setState({modal: <LoginModal isOpen={true} hideModal={this.hideModal} setAuth={this.setAuth}/>});
        };
    };

    buildContent(view) {
        return (
            <>
                {this.state.modal}
                <div className="pageHeader">
                     <h2>Inventory App</h2>
                     <div id='userProfile'>
                        {this.state.isLoggedIn ? <label>{this.state.auth.user.userName} : {this.state.auth.user.userRole}</label> : null}
                        <button className='logInLogOut' onClick={this.loginLogout}>
                            {this.state.isLoggedIn ? 'Log Out': 'Log In'}
                        </button>
                     </div>
                     
                </div>
                <div className="pageBody">
                    <ContentList 
                        role={this.state.role}
                        editControlIsVisible={view.editControlIsVisible} 
                        userContentIsVisible={view.userContentIsVisible} 
                        signItemInOutIsVisible={view.signItemInOutIsVisible}
                    />
                    <div className='pageFooter'>
                        <ItemLogDisplay itemLogIsVisible={view.itemLogIsVisible} />
                        {view.adminLogIsVisible ? 
                            <button onClick={() => this.showAdminLogModal()}>Show Admin Logs</button> : 
                            null
                        }
                    </div>
                </div>
            </>
        );
    };

    render () {
        if (this.error) {throw this.error};
        return(this.buildContent(this.state.view));
    };
};