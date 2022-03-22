import React from 'react';
import '@fluentui/react';
import '../styles/App.css';
import { AuthController }       from '../controllers';
import ContentList              from './ContentList';
import ItemLogModal             from './LogModals/ItemLogModal';
import AdminLogModal            from './LogModals/AdminLogModal';
import LoginModal               from './ProfileModals/LoginModal';
import LogoutModal              from './ProfileModals/LogoutModal';
import { displayPresets }       from './ContentPresets';
import profileIcon              from '../styles/profile_icon_25x25.jpg';

/*
*   Builds the page by calling components and passing down what should be visible
*/
export default class ContentBuilder extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            auth:             null,
            view:             displayPresets.main,
            isLoggedIn:       false,
            modal:            null,
            role:             null,
            isDropdownActive: false
        };

        this.error = null;

        this.setAuth        = this.setAuth.bind(this);
        this.hideModal      = this.hideModal.bind(this);
        this.clearAuth      = this.clearAuth.bind(this);
    };

    async componentDidMount() {
        let auth = await AuthController.checkToken();
        
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
            this.setState({ 
                auth: auth, 
                isLoggedIn: true, 
                view: displayPresets[auth.user.userRole]
            });
        } else {
            this.clearAuth();
            return;
        };
        this.setState({ role: auth.user.userRole });
    };

    clearAuth() {
        this.setState({ 
            auth: null, 
            isLoggedIn: false, 
            view: displayPresets.main
        });
    };

    hideModal() {
        this.setState({ modal: null });
    };

    loginLogout() {
        if (this.state.isLoggedIn) {
            this.setState({
                modal: <LogoutModal 
                    auth={this.state.auth} 
                    isOpen={true} 
                    hideModal={this.hideModal} 
                    clearAuth={this.clearAuth}
                />
            });
        } else {
            this.setState({
                modal: <LoginModal 
                    isOpen={true} 
                    hideModal={this.hideModal} 
                    setAuth={this.setAuth}
                />
            });
        };
    };

    showItemLogModal(){
        this.setState({ 
            modal: <ItemLogModal 
                isOpen={true} 
                hideModal={this.hideModal} 
            /> 
        });
    }

    showAdminLogModal() {
        this.setState({ 
            modal: <AdminLogModal 
                isOpen={true} 
                hideModal={this.hideModal}
            />  
        });
    }

    buildContent(view) {
        return (
            <>
            {this.state.modal}
            <div className="pageHeader">
                    <h2>Inventory App</h2>
                    { this.state.isLoggedIn ? 
                    <div className='profileContainer Main'>
                        <button onClick={ () => { this.setState({ isDropdownActive : true}) } }><img src={ profileIcon } alt='My Profile'/></button>
                        <div className='profileContainer DropDown'>
                            <div className='contentContainer Text'>
                                <label>Account:</label>
                                <label>{ this.state.auth.user.userName }</label>
                            </div>
                            <div className='contentDivider'></div>
                            <div className='contentContainer Action'>
                                <button hidden={ !view.itemLogIsVisible } onClick={ () => this.showItemLogModal() }>Item Logs</button>
                                <button hidden={ !view.adminLogIsVisible } onClick={ () => this.showAdminLogModal() }>Admin Logs</button>
                            </div>
                            <div className='contentDivider'></div>
                            <div className='contentContainer Action'>
                                <button onClick={ () => this.loginLogout() }>Logout</button>
                            </div>
                        </div>
                    </div> : 
                    <button className='logInLogOut' onClick={ () => this.loginLogout() }>Login</button> }
            </div>
            <div className="pageBody">
                <ContentList 
                    role={this.state.role}
                    editControlIsVisible={view.editControlIsVisible} 
                    userContentIsVisible={view.userContentIsVisible} 
                    signItemInOutIsVisible={view.signItemInOutIsVisible}
                />
            </div>
            </>
        );
    };

    render () {
        if (this.error) {throw this.error};
        return(this.buildContent(this.state.view));
    };
};