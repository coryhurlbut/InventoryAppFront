import React                    from 'react';

import { 
    ItemEditControls,
    UserEditControls,
    SignItemInOutControls 
}                               from './controls';
import { 
    itemController,
    userController 
}                               from '../controllers';
import { 
    availableItemsContent, 
    unavailableItemsContent, 
    usersContent 
}                               from './contentPresets';
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
            isUserContentVisible:       props.isUserContentVisible,
            isEditControlVisible:       props.isEditControlVisible,
            isSignItemInOutVisible:     props.isSignItemInOutVisible,
            contentType:                availableItemsContent.contentType,
            editControls:               availableItemsContent.editControls,
            inOrOut:                    availableItemsContent.inOrOut,
            content:                    [],
            selectedIds:                [],             //Now holds itemNumber or userName instead of _id
            selectedObjects:            [],
            _btnAI_Active:              false,
            _btnUI_Active:              false,
            _btnU_Active:               false,
            accountRole:                props.accountRole,
            _isError:                   false,
            _errorMessage:              ''
        };
        
        this.setParentState         =   this.setParentState.bind(this);
    };

    // Will update component props if parent props change
    componentDidUpdate(prevProps, prevState) {
        if(this.props !== prevProps) {
            this.setState({
                isUserContentVisible:   this.props.isUserContentVisible,
                isEditControlVisible:   this.props.isEditControlVisible,
                isSignItemInOutVisible: this.props.isSignItemInOutVisible,
                accountRole:            this.props.accountRole
            });
        };

        //Resets content to available items after admin logout. Stops displaying users after logout if viewing as admin.
        if(prevProps.isUserContentVisible && !this.props.isUserContentVisible) {
            this._showAvailableItems();
        };
    };

    componentDidMount() {
        try {
            this._showAvailableItems();
        } catch(error) {
            this.setState({_isError: true,
                _errorMessage: error.message
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
            selectedIds:        [],
            selectedObjects:    [],
            _btnAI_Active:      true,
            _btnUI_Active:      false,
            _btnU_Active:       false
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
            selectedIds:        [],
            selectedObjects:    [],
            _btnAI_Active:      false,
            _btnUI_Active:      true,
            _btnU_Active:       false
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
            selectedIds:        [],
            selectedObjects:    [],
            _btnAI_Active:      false,
            _btnUI_Active:      false,
            _btnU_Active:       true
        });
    }
    
    //Callback function passed to table component.
    //Bound to ContentList state to update this state when called by child component.
    setParentState = (obj) => {
        let arr = this.state.selectedIds;
        let objArr = this.state.selectedObjects;
        let id = obj.itemNumber ? obj.itemNumber : obj.userName; //If obj is an item, take the itemNumber. Otherwise, take the userName
        
        if(arr.includes(id)) {
            arr = arr.filter(el => el !== id);
            objArr = objArr.filter(object => object.itemNumber !== id);
            objArr = objArr.filter(object => object.userName !== id);
        } else {
            arr.push(id);
            objArr.push(obj);
        };

        this.setState({selectedIds: arr, selectedObjects: objArr});
    }

    _buildContentList = () => {
        if(this.state.content.length !== 0) {
            return(
                <>
                <div id="tableModification">
                    {this._buildEditControls()}
                    {this.state.isSignItemInOutVisible ? 
                        <SignItemInOutControls 
                            inOrOut={this.state.inOrOut} 
                            selectedIds={this.state.selectedIds} 
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
                    userRole={this.state.accountRole} 
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
            this.state.isEditControlVisible
        ) {
            return(
                <ItemEditControls 
                    selectedIds={this.state.selectedIds} 
                    selectedObjects={this.state.selectedObjects} 
                />
            );
        } else if(this.state.editControls === 'UserEditControls') {
            return(
                <UserEditControls 
                    selectedIds={this.state.selectedIds} 
                    selectedObjects={this.state.selectedObjects} 
                    accountRole={this.state.accountRole}
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
                                className={this.state._btnAI_Active ? "btnSelected" : null} 
                                onClick={() => {this._showAvailableItems()}}
                            >
                                Available Items
                            </button>
                            <div className="itemStyling">|</div>
                            <button 
                                className={this.state._btnUI_Active ? "btnSelected" : null} 
                                onClick={() => {this._showUnavailableItems()}}
                            >
                                Unavailable Items
                            </button>
                            {this.state.isUserContentVisible ? <div className="itemStyling">|</div> : null}
                            {this.state.isUserContentVisible ? 
                                <button 
                                    className={this.state._btnU_Active ? "btnSelected" : null}
                                    onClick={() => {this._showUsers()}}
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

    render() {
        return(
            <div id="contentBody">
                { this.state._isError ? this.state._errorMessage : this._renderContentBody()}
            </div>
        );
    };
};
