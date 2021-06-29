import React                        from 'react';
import { DetailsList}               from '@fluentui/react';
import ItemEditControls             from './ItemEditControls';
import UserEditControls             from './UserEditControls';
import SignItemInOutControls        from './SignItemInOutControls';
import ItemController               from '../controllers/ItemController';
import UserController               from '../controllers/UserController';
// import { HybridTable }             from './Table/HybridTable';
import { RowSelection }             from './Table/RowSelection';
import TestComponent from './testcomponent';
import '../styles/App.css';

//Settings for which data is displaying in the table
const availableItemsContent = {
    contentType:        "Available Items",
    editControls:       "ItemEditControls",
    inOrOut:            "Sign Item Out"
};
const unavailableItemsContent = {
    contentType:        "Unavailable Items",
    editControls:       "ItemEditControls",
    inOrOut:            "Sign Item In"
};
const usersContent = {
    contentType:        "Users",
    editControls:       "UserEditControls",
    inOrOut:            ""
};

/*
*   Displays main content. Changes depending on what data is displayed. Available Items, Unavailable Items, or Users.
*/
export default class ContentList extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            userContentIsVisible:       props.userContentIsVisible,
            editControlIsVisible:       props.editControlIsVisible,
            signItemInOutIsVisible:     props.signItemInOutIsVisible,
            contentType:                availableItemsContent.contentType,
            editControls:               availableItemsContent.editControls,
            inOrOut:                    availableItemsContent.inOrOut,
            content:                    []
        };
        
        this.showAvailableItems     =   this.showAvailableItems.bind(this);
        this.showUnavailableItems   =   this.showUnavailableItems.bind(this);
        this.showUsers              =   this.showUsers.bind(this);

    };

    async componentDidMount () {
        let items = await ItemController.getAvailableItems();
        this.setState({content: items});
    };

    async showAvailableItems () {
        let items = await ItemController.getAvailableItems();  
        this.setState({
            content:            items,
            contentType:        availableItemsContent.contentType,
            editControls:       availableItemsContent.editControls,
            inOrOut:            availableItemsContent.inOrOut
        });
    };

    async showUnavailableItems () {
        let items = await ItemController.getUnavailableItems();
        this.setState({
            content:            items,
            contentType:        unavailableItemsContent.contentType,
            editControls:       unavailableItemsContent.editControls,
            inOrOut:            unavailableItemsContent.inOrOut
        }); 
    };

    async showUsers () {
        let users = await UserController.getAllUsers();
        this.setState({
            content:            users,
            contentType:        usersContent.contentType,
            editControls:       usersContent.editControls,
            inOrOut:            usersContent.inOrOut
        });  
    };

    buildContentList () {
        return(
            <div className="table">
                {this.state.contentType}
                <RowSelection data={this.state.content} />
            </div>
        );
    };

    buildEditControls () {
        if(this.state.editControls === "ItemEditControls" && this.state.editControlIsVisible) {
            return (
                <ItemEditControls />
            );
        } else if (this.state.editControls === "UserEditControls") {
            return (
                <UserEditControls />
            );
        };
    };

    render() {
        return (
            <div>
                <div>
                    <button onClick={this.showAvailableItems}>
                        Available Items
                    </button>
                    <button onClick={this.showUnavailableItems}>
                        Unavailable Items
                    </button>
                    {this.state.userContentIsVisible ? <button onClick={this.showUsers}>Users</button> : null}
                </div>
                {this.buildContentList()}
                {this.buildEditControls()}
                <SignItemInOutControls inOrOut={this.state.inOrOut} signItemInOutIsVisible={this.state.signItemInOutIsVisible}/>
                <TestComponent/>
            </div>
        );
    };
};