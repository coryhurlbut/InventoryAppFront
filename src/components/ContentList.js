import React                        from 'react';
import ItemEditControls             from './ItemEditControls';
import UserEditControls             from './UserEditControls';
import SignItemInOutControls        from './SignItemInOutControls';
import ItemController               from '../controllers/ItemController';
import UserController               from '../controllers/UserController';
// import { HybridTable }             from './Table/HybridTable';
import { RowSelection }             from './Table/RowSelection';
import TestComponent                from './testcomponent';
import NewTable from './NewTable';
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
        this.getSelectedItems       =   this.getSelectedItems.bind(this);
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.props.userContentIsVisible     !== prevProps.userContentIsVisible ||
            this.props.editControlIsVisible     !== prevProps.editControlIsVisible ||
            this.props.signItemInOutIsVisible   !== prevProps.signItemInOutIsVisible) {
    
            this.setState({
                userContentIsVisible:       this.props.userContentIsVisible,
                editControlIsVisible:       this.props.editControlIsVisible,
                signItemInOutIsVisible:     this.props.signItemInOutIsVisible
            });
        };

        //Resets content to available items after admin logout. Stops displaying users after logout if viewing as admin.
        if (prevProps.userContentIsVisible && !this.props.userContentIsVisible) {
            this.showAvailableItems();
        };
    };

    componentDidMount () {
        this.showAvailableItems();
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
    getSelectedItems(items) {
        console.log(items)
        this.setState({items: items});
    }

    buildContentList () {
        return(
            <div className="table">
                {this.state.contentType}
                <NewTable callback={this.getSelectedItems} data={this.state.content} />
            </div>
        );
    };

    buildEditControls () {
        if (!this.state.editControlIsVisible) return
        if (this.state.editControls === "UserEditControls") {
            return (
                <UserEditControls />
            );
        };
    };

    render() {
        // Check for content and build list if it's present.
        // Otherwise return null
        let contentList = this.state.content.length > 0 ? this.buildContentList() : null;

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
                {contentList}
                {this.buildEditControls()}
                <SignItemInOutControls inOrOut={this.state.inOrOut} signItemInOutIsVisible={this.state.signItemInOutIsVisible}/>
                <TestComponent/>
            </div>
        );
    };
};