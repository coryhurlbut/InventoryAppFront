import React                        from 'react';
import ItemEditControls             from './ItemEditControls';
import UserEditControls             from './UserEditControls';
import SignItemInOutControls        from './SignItemInOutControls';
import ItemController               from '../controllers/ItemController';
import UserController               from '../controllers/UserController';
import TestComponent                from './testcomponent';
import './Table/table.css';
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
            content:                    [],
            id:                         null
        };
        
        this.showAvailableItems     =   this.showAvailableItems.bind(this);
        this.showUnavailableItems   =   this.showUnavailableItems.bind(this);
        this.showUsers              =   this.showUsers.bind(this);
        this.getSelectedItems       =   this.getSelectedItems.bind(this);
    };

    // Will update component props if parent props change
    componentDidUpdate(prevProps, prevState) {
        if (this.props !== prevProps) {
    
            this.setState({
                userContentIsVisible:       this.props.userContentIsVisible,
                editControlIsVisible:       this.props.editControlIsVisible,
                signItemInOutIsVisible:     this.props.signItemInOutIsVisible,
                id:                         this.props.id
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
            content:            items || null,
            contentType:        availableItemsContent.contentType,
            editControls:       availableItemsContent.editControls,
            inOrOut:            availableItemsContent.inOrOut
        });
    };

    async showUnavailableItems () {
        let items = await ItemController.getUnavailableItems();
        this.setState({
            content:            items || null,
            contentType:        unavailableItemsContent.contentType,
            editControls:       unavailableItemsContent.editControls,
            inOrOut:            unavailableItemsContent.inOrOut
        }); 
    };

    async showUsers () {
        let users = await UserController.getAllUsers();
        console.log(users)
        this.setState({
            content:            users || null,
            contentType:        usersContent.contentType,
            editControls:       usersContent.editControls,
            inOrOut:            usersContent.inOrOut
        });  
    };

    getSelectedItems(items) {
        this.setState({items: items});
    };

    buildContentList () {
        return(
            <div className="table">
                {this.state.contentType}
                <h1 id='title'></h1>
            <table id='items'>
                    {this.renderTableHeader()}
                <tbody>
                    {this.renderTableData()}
                </tbody>
            </table>
            <pre></pre>
            </div>
        );
    };

    buildEditControls () {
        if(this.state.editControls === "ItemEditControls" && this.state.editControlIsVisible) {
            return (
                <ItemEditControls id={this.state.id}/>
            );
        } else if (this.state.editControls === "UserEditControls") {
            return (
                <UserEditControls id={this.state.id}/>
            );
        };
    };
    renderTableData(){
        
        if(this.state.contentType === "Users"){
            return this.state.content.map((user, index) => {
                const { _id, firstName, lastName, userName, userRole, phoneNumber } = user
                return(
                    <tr key={_id}>
                    <input type='checkbox' id={_id} onClick={() => {this.setState({id: _id})}}></input>
                    <td>{_id}</td>
                    <td>{firstName}</td>
                    <td>{lastName}</td>
                    <td>{userName}</td>
                    <td>{userRole}</td>
                    <td>{phoneNumber}</td>
                </tr>
            )})
        }
        else {
            return this.state.content.map((item, index) => {
                const { _id, name, description, homeLocation, specificLocation, serialNumber, notes } = item
                return(
                    
                    <tr key={_id}>
                    <input type='checkbox' id={_id} onClick={() => {this.setState({id: _id})}}></input>
                    <td>{_id}</td>
                    <td>{name}</td>
                    <td>{description}</td>
                    <td>{homeLocation}</td>
                    <td>{specificLocation}</td>
                    <td>{serialNumber}</td>
                    <td>{notes}</td>
                </tr>
            )})
        }
    }
    renderTableHeader() {
        if(this.state.contentType === "Users"){
            return(
                <thead>
                    <th></th>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Phone Number</th>
                </thead>
            )
        }
        else{
            return(
                <thead>
                    <th></th>
                    <th>ID</th>
                    <th>Item Name</th>
                    <th>Description</th>
                    <th>Location</th>
                    <th>Specific Location</th>
                    <th>Serial Number</th>
                    <th>Notes</th>
                </thead>
            )
        }
    }

    render() {
        // Check for content and build list if it's present.
        // Otherwise return null
        let contentList = this.state.content !== null ? this.buildContentList() : 'No content available.';

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
                {/* <TestComponent/> */}
            </div>
        );
    };
};