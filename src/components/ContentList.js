import React                    from 'react';

import { ItemEditControls,
    UserEditControls,
    SignItemInOutControls }     from './controls';
import { itemController,
    userController }            from '../controllers';
import { availableItemsContent, 
    unavailableItemsContent, 
    usersContent }              from './contentPresets';
import Table                    from './Table';
import ToggleSwitch             from './ToggleSwitch';
import '../styles/Table.css';
import '../styles/App.css';
import '../styles/Modal.css';


/*
*   Displays main content. Changes depending on what data is displayed. Available Items, Unavailable Items, or Users.
*/
export default class ContentList extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            userContentIsVisible:       props.userContentIsVisible,
            editControlIsVisible:       props.editControlIsVisible,
            signItemInOutIsVisible:     props.signItemInOutIsVisible,
            contentType:                availableItemsContent.contentType,
            editControls:               availableItemsContent.editControls,
            inOrOut:                    availableItemsContent.inOrOut,
            content:                    [],
            idArray:                    [],
            selectedObjects:            [],
            btnAI_Active:               false,
            btnUI_Active:               false,
            btnU_Active:                false,
            role:                       props.role,
            isError:                    false,
            errorMessage:               ''
        };
        
        this.showAvailableItems     =   this._showAvailableItems.bind(this);
        this.showUnavailableItems   =   this._showUnavailableItems.bind(this);
        this.showUsers              =   this._showUsers.bind(this);
        this.setParentState         =   this._setParentState.bind(this);
    };

    // Will update component props if parent props change
    componentDidUpdate(prevProps, prevState) {
        if(this.props !== prevProps) {
            this.setState({
                userContentIsVisible:   this.props.userContentIsVisible,
                editControlIsVisible:   this.props.editControlIsVisible,
                signItemInOutIsVisible: this.props.signItemInOutIsVisible,
                role:                   this.props.role
            });
        };

        //Resets content to available items after admin logout. Stops displaying users after logout if viewing as admin.
        if(prevProps.userContentIsVisible && !this.props.userContentIsVisible) {
            this._showAvailableItems();
        };
    };

    componentDidMount() {
        try {
            this._showAvailableItems();
        } catch(error) {
            this.setState({isError: true,
                errorMessage: error.message
            });
        }
    };

    _showAvailableItems = async () => {
        let items = await itemController.getAvailableItems();
        this.setState({
            content:            items || null,
            contentType:        availableItemsContent.contentType,
            editControls:       availableItemsContent.editControls,
            inOrOut:            availableItemsContent.inOrOut,
            columns:            availableItemsContent.columns,
            idArray:            [],
            selectedObjects:    [],
            btnAI_Active:       true,
            btnUI_Active:       false,
            btnU_Active:        false
        });
    };

    _showUnavailableItems = async () => {
        let items = await itemController.getUnavailableItems();
        this.setState({
            content:            items || null,
            contentType:        unavailableItemsContent.contentType,
            editControls:       unavailableItemsContent.editControls,
            inOrOut:            unavailableItemsContent.inOrOut,
            columns:            unavailableItemsContent.columns,
            idArray:            [],
            selectedObjects:    [],
            btnAI_Active:       false,
            btnUI_Active:       true,
            btnU_Active:        false
        });
    };

    _showUsers = async () => {
        let users = await userController.getAllUsers();
        this.setState({
            content:            users || null,
            contentType:        usersContent.contentType,
            editControls:       usersContent.editControls,
            inOrOut:            usersContent.inOrOut,
            columns:            usersContent.columns,
            idArray:            [],
            selectedObjects:    [],
            btnAI_Active:       false,
            btnUI_Active:       false,
            btnU_Active:        true
        });
    }

    _clearChecks = () => {
        this.setState({ idArray: [], selectedObjects: [] });
    }

    //Callback function passed to table component.
    //Bound to ContentList state to update this state when called by child component.
    _setParentState = (user) => {
        let arr = this.state.idArray;
        let selectedObjects = this.state.selectedObjects;
        if(arr.includes(user._id)) {
            arr = arr.filter(el => el !== user._id);
            selectedObjects = selectedObjects.filter(object => object._id !== user._id);
        } else {
            arr.push(user._id);
            selectedObjects.push(user);
        };

        this.setState({idArray: arr, selectedObjects: selectedObjects});
    }

    _buildContentList = () => {
        if(this.state.content.length !== 0) {
            return(
                <>
                <div id="tableModification">
                    {this._buildEditControls()}
                    {this.state.signItemInOutIsVisible ? 
                        <SignItemInOutControls 
                            inOrOut={this.state.inOrOut} 
                            idArray={this.state.idArray} 
                            selectedObjects={this.state.selectedObjects} 
                            id={this.state.id} 
                        /> : 
                        null
                    }            
                </div>
                <Table 
                    columns={this.state.columns} 
                    data={this.state.content} 
                    setParentState={this.setParentState} 
                    userRole={this.state.role} 
                    contentType={this.state.contentType}
                />
                </>
            );
        } else{
            return(
                <>
                <p id="noContent">No content available</p>
                </>
            );
        }
    };

    _buildEditControls () {
        if(this.state.editControls === 'ItemEditControls' && 
            this.state.editControlIsVisible
        ) {
            return(
                <ItemEditControls 
                    idArray={this.state.idArray} 
                    selectedObjects={this.state.selectedObjects} 
                />
            );
        } else if(this.state.editControls === 'UserEditControls') {
            return(
                <UserEditControls 
                    idArray={this.state.idArray} 
                    selectedObjects={this.state.selectedObjects} 
                    role={this.state.role}
                />
            );
        };
    };

    _renderContentBody = () => {
        return (
            <>
                <div id="userControls">
                        <div id="tableNavigation">
                            <button 
                                className={this.state.btnAI_Active ? "btnSelected" : null} 
                                onClick={() => {this._showAvailableItems(); this._clearChecks();}}
                            >
                                Available Items
                            </button>
                            <div className="itemStyling">|</div>
                            <button 
                                className={this.state.btnUI_Active ? "btnSelected" : null} 
                                onClick={() => {this._showUnavailableItems(); this._clearChecks();}}
                            >
                                Unavailable Items
                            </button>
                            {this.state.userContentIsVisible ? <div className="itemStyling">|</div> : null}
                            {this.state.userContentIsVisible ? 
                                <button 
                                    className={this.state.btnU_Active ? "btnSelected" : null} 
                                    onClick={() => {this._showUsers(); this._clearChecks();}}
                                >
                                    Users
                                </button> : 
                                null
                            }
                        </div>
                        <ToggleSwitch />
                    </div>
                    <div id="tableBody">
                        {this._buildContentList()}
                    </div>
            </>
        );
    }

    _renderErrorMessage = () => {
        return (
            <p>
                {this.errorMessage}
            </p>
        );
    };

    render() {
        return(
            <div id="contentBody">
                { this.state.isError ? this._renderErrorMessage() : this._renderContentBody()}
            </div>
        );
    };
};
