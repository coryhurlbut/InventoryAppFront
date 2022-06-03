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
import {Table, TableNav }       from './tableStuff';
import ToggleSwitch             from './utilities/ToggleSwitch';
import '../styles/Table.css';
import '../styles/App.css';
import GenerateReport           from './utilities/GenerateReport';

/*
*   Displays main content. Changes depending on what data is displayed. Available Items, Unavailable Items, or Users.
*/
const NO_CONTENT = 'No content available';
const ERROR_MESSAGE_LINK = 'Please Click Here';

const CERTIFICATE_REDIRECT = "https://ec2-15-205-215-189.us-gov-west-1.compute.amazonaws.com:8000/";
const CERTIFICATE_REDIRECT_LOCAL = "https://localhost:8000/items/available";

export default class ContentList extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isUserContentVisible        : props.isUserContentVisible,
            isEditControlVisible        : props.isEditControlVisible,
            isSignItemInOutVisible      : props.isSignItemInOutVisible,
            contentType                 : availableItemsContent.contentType,
            editControls                : availableItemsContent.editControls,
            inOrOut                     : availableItemsContent.inOrOut,
            content                     : [],
            selectedIds                 : [],             //Now holds itemNumber or userName instead of _id
            selectedObjects             : [],
            accountRole                 : props.accountRole,
            isError                     : false,
            errorMessage                : '',
            modal                       : null
        };
        
        this.setParentState        =   this._setParentState.bind(this);
        this.parseRowsArray        =   this._parseRowsArray.bind(this);
        this.handleTableDisplay    =   this._handleTableDisplay.bind(this);
        this.allItems = [];
    };

    // Will update component props if parent props change
    componentDidUpdate(prevProps, prevState) {
        if(this.props !== prevProps) {
            this.setState({
                isUserContentVisible    : this.props.isUserContentVisible,
                isEditControlVisible    : this.props.isEditControlVisible,
                isSignItemInOutVisible  : this.props.isSignItemInOutVisible,
                accountRole             : this.props.accountRole
            });
        };

        //Resets content to available items after admin logout. Stops displaying users after logout if viewing as admin.
        if(prevProps.isUserContentVisible && !this.props.isUserContentVisible) {
            this._handleTableDisplay('availableItems');
        };
    };

    componentDidMount() {
        this._handleTableDisplay('availableItems');
    };

    _handleTableDisplay = async (objectType) => {
        let content;
        let object = {};

        if(objectType === 'availableItems'){
            content = await itemController.getAvailableItems();
            object = availableItemsContent;
            
        }else if(objectType === 'unavailableItems'){
            content = await itemController.getUnavailableItems();
            object = unavailableItemsContent;
        }
        else{
            content = await userController.getAllUsers();
            object = usersContent;
        }

        //Display error, avoid app crashing
        if(!content){
            this.setState({
                isError: true,
                errorMessage: 'There was an issue during authentication.'
            });
        }

        this.setState({
            content         : content || null,
            contentType     : object.contentType,
            editControls    : object.editControls,
            inOrOut         : object.inOrOut,
            columns         : object.columns,
            selectedIds     : [],
            selectedObjects : [],
        });
    }
    //TO-DO this can probably be way less code, and also probably be within setParentState method, fix for toggleAllRowsSelected
    _parseRowsArray = (rowss, isSelectedd) =>{
        if(!isSelectedd){
            for (let i = 0; i < rowss.length; i++) {
                this.setParentState(rowss[i].original);
            }
        }else{
            this.setState({ selectedIds: [], selectedObjects: []});
        }
    }
    
    //Callback function passed to table component.
    //Bound to ContentList state to update this state when called by child component.
    _setParentState = (obj) => {
        let arr     = this.state.selectedIds;
        let objArr  = this.state.selectedObjects;
        let id      = obj.itemNumber ? obj.itemNumber : obj.userName; //If obj is an item, take the itemNumber. Otherwise, take the userName
        
        if(arr.includes(id)) {
            arr     = arr.filter(el => el !== id);
            objArr  = objArr.filter(object => object.itemNumber !== id);
            objArr  = objArr.filter(object => object.userName !== id);
        } else {
            arr.push(id);
            objArr.push(obj);
        };

        this.setState({ 
            selectedIds: arr, 
            selectedObjects: objArr 
        });
    }

    _buildContentList = () => {
        if(!this.state.isError){
            if(this.state.content.length === 0){
                return(
                    <p id="noContent">{NO_CONTENT}</p>
                )
            }
            return(
                <>
                    <Table
                        columns={this.state.columns}
                        data={this.state.content}
                        setParentState={this.setParentState}
                        parseRowsArray={this._parseRowsArray}
                        userRole={this.state.accountRole}
                        contentType={this.state.contentType}
                    />
                </>
            );
        }
    };

    _buildEditControls = () => {
        if(this.state.editControls === 'ItemEditControls' &&
            this.state.isEditControlVisible
        ) {
            return(
                <ItemEditControls 
                    selectedIds={this.state.selectedIds} 
                    selectedObjects={this.state.selectedObjects}
                    accountRole={this.state.accountRole} 
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

    _getAllItemsForReport = async() => {
        this.allItems = await itemController.getAllItems();
        this.setState({
            modal: <GenerateReport 
                items={this.allItems}
                isOpen={true}
            />
        })
    }

    _renderContentBody = () => {
        return (
            <>
                <div id="userControls">
                    <TableNav
                        clickFunction={this._handleTableDisplay} 
                        isUserContentVisible={this.state.isUserContentVisible}
                    />
                    <button onClick={this._getAllItemsForReport}>
                        GenerateReport
                    </button>
                </div>
                <div id="tableBody">
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
                    {this._buildContentList()}
                </div>
            </>
        );
    }

    _renderErrorDisplay = () => {
        return (
            <>
                <div>
                    <p className='centerText'>{this.state.errorMessage}</p>
                    <a href={CERTIFICATE_REDIRECT} className='centerText'>{ERROR_MESSAGE_LINK}</a>
                </div>
            </>
        );
    }

    render() {
        return(
            <div id="contentBody">
                {this.state.modal}
                {this.state.isError ? 
                    this._renderErrorDisplay() : 
                    this._renderContentBody()
                }
            </div>
        );
    };
};
