import React from 'react';

import { authController, 
    userController }            from '../controllers';
import ContentList              from './ContentList';
import { ItemLogModal,
    AdminLogModal,
    ApproveUsersModal }         from './logModals';
import { LoginModal,
    LogoutModal }               from './profileModals';
import { displayPresets }       from './contentPresets';
import profileIcon              from '../styles/Images/profileIcon25x25.jpg';
import '../styles/App.css';

/*
*   Builds the page by calling components and passing down what should be visible
*/
const PENDING_USER_NOTIFICATION = '•';

const PAGE_TITLE = 'Inventory App';

const DROP_DOWN_ACCOUNT_DETAILS = 'Account:';

const BTN_ITEM_LOG = 'View Item Logs';
const BTN_ADMIN_LOG = 'View Admin Logs';
const BTN_PENDING_USERS = 'View Pending Users';
const BTN_LOGOUT = 'Logout';
const BTN_LOGIN  = 'Login';

export default class ContentBuilder extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            accountAuth         : null,
            view                : displayPresets.main,
            _isLoggedIn         : false,
            _modal              : null,
            accountRole         : null,
            _isDropdownActive   : false,
            pendingUsers        : null
        };
        this._isUsersPending    = false;
        this._isError           = null;
    };

    async componentDidMount() {
        let auth  = await authController.checkToken();
        let users = await userController.getPendingUsers();

        if(users.length > 0) {
            this._isUsersPending = true;
            this.setState({ pendingUsers: users });
        }
        
        if(auth === undefined || auth.error !== undefined) {
            this._clearAuth();
        } else if (typeof auth === 'string' && auth.split(' ')[0] === 'TypeError:') {
            this._isError = auth;
        } else {
            this._setAuth(auth);
        }
    };

    _setAuth = (auth) => {
        if(auth.user.userRole === 'admin' || auth.user.userRole === 'custodian') {
            this.setState({ 
                accountAuth : auth, 
                _isLoggedIn : true, 
                view        : displayPresets[auth.user.userRole]
            });
        } else {
            this._clearAuth();
            return;
        };
        this.setState({accountRole: auth.user.userRole});
    };

    _clearAuth = () => {
        this.setState({ 
            accountAuth : null, 
            _isLoggedIn : false, 
            view        : displayPresets.main
        });
    };

    _hideModal = () => {
        this.setState({_modal: null});
    };

    //accepts string parameter to decide which Modal to display
    _showModal = (modalType) => {
        let modal;
        switch(modalType){
            case 'loginLogout':
                if(this.state._isLoggedIn) {
                    modal = <LogoutModal 
                        auth={this.state.accountAuth} 
                        isOpen
                        hideModal={this._hideModal} 
                        clearAuth={this._clearAuth}
                    />
                } else {
                    modal = <LoginModal 
                        isOpen
                        hideModal={this._hideModal} 
                        setAuth={this._setAuth}
                    />
                };
                break;
            case 'itemLog':
                modal = <ItemLogModal 
                    isOpen
                    hideModal={this._hideModal} 
                />
                break;
            case 'adminLog':
                modal = <AdminLogModal 
                    isOpen
                    hideModal={this._hideModal}
                />
                break;
            case 'userApproval':
                modal = <ApproveUsersModal
                    isOpen
                    hideModal={this._hideModal}
                    content={this.state.pendingUsers}
                    accountRole={this.state.accountRole}
                    contentType={'Users'}
                />
                break;
            default:
                break;
        }
        this.setState({ _modal: modal });
    }
    //checks if there are any pending users, then returns red dot if there are users 
    // https://www.magicbell.com/blog/react-notification-badges
    _pendingUsersRedDot = () => {
        if(this._isUsersPending){
            return(
                <span className='PendingUserNotification' id='PendingIcon'>
                    {PENDING_USER_NOTIFICATION}
                </span>
            )
        }
    }

    _buildContent = (view) => {
        return (
            <>
            {this.state._modal}
            <div className="pageHeader">
                <h2>{PAGE_TITLE}</h2>
                {this.state._isLoggedIn ? 
                    <div className="profileContainer Main">
                        <button onClick={() => 
                            {this.setState({_isDropdownActive : true})}}
                        >
                            <img src={profileIcon} alt="My Profile"/>
                        </button>
                        <div className="profileContainer DropDown">
                            <div className="contentContainer Text">
                                <label>{DROP_DOWN_ACCOUNT_DETAILS}</label>
                                <label>{this.state.accountAuth.user.userName}</label>
                            </div>
                            <div className="contentDivider"/>
                            <div className="contentContainer Action">
                                <button 
                                    hidden={!view.isItemLogVisible} 
                                    onClick={() => this._showModal('itemLog')}
                                >
                                    {BTN_ITEM_LOG}
                                </button>
                                <button 
                                    hidden={!view.isAdminLogVisible} 
                                    onClick={() => this._showModal('adminLog')}
                                >
                                    {BTN_ADMIN_LOG}
                                </button>
                                <span className='PendingUserNotification'>
                                    <button 
                                        hidden={!view.isItemLogVisible}
                                        onClick={() => this._showModal('userApproval')}
                                    >
                                        {BTN_PENDING_USERS}
                                    </button>
                                    {this._pendingUsersRedDot()}
                                </span>
                            </div>
                            <div className="contentDivider"/>
                            <div className="contentContainer Action">
                                <button onClick={() => this._showModal('loginLogout')}>{BTN_LOGOUT}</button>
                            </div>
                        </div>
                    </div> : 
                    <button 
                        className="logInLogOut"
                        onClick={() => this._showModal('loginLogout')}
                    >
                        {BTN_LOGIN}
                    </button>
                }
            </div>
            <div className="pageBody">
                <ContentList 
                    accountRole={this.state.accountRole}
                    isEditControlVisible={view.isEditControlVisible}
                    isUserContentVisible={view.isUserContentVisible}
                    isSignItemInOutVisible={view.isSignItemInOutVisible}
                />
            </div>
            </>
        );
    };

    render () {
        if (this._isError) {throw this._isError};
        return(this._buildContent(this.state.view));
    };
};