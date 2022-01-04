import React                        from 'react';
import ItemEditControls             from './ItemEditControls';
import UserEditControls             from './UserEditControls';
import SignItemInOutControls        from './SignItemInOutControls';
import ItemController               from '../controllers/ItemController';
import UserController               from '../controllers/UserController';
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
            id:                         null,
            parents:                    [],
            idArray:                    [],
            isChecked:                  null
        };
        
        this.showAvailableItems     =   this.showAvailableItems.bind(this);
        this.showUnavailableItems   =   this.showUnavailableItems.bind(this);
        this.showUsers              =   this.showUsers.bind(this);
        this.getParentItems         =   this.getParentItems.bind(this);
        this.checkForChecked        =   this.checkForChecked.bind(this);
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
        this.getParentItems();
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

    async getParentItems () {
        let parents = await ItemController.getParentItems();

        this.setState({parents: parents});
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

    //ToDo: Remove h1, isn't in use
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
                <ItemEditControls id={this.state.id} parents={this.state.parents} idArray={this.state.idArray}/>
            );
        } else if (this.state.editControls === "UserEditControls") {
            return (
                <UserEditControls id={this.state.id}/>
            );
        };
    };

    checkForChecked (id, name){
        if(document.getElementById(`${id}`).checked){
            let idArr = this.state.idArray;
            idArr.push(id);
            this.setState({idArray: idArr});
        }
        if(!document.getElementById(`${id}`).checked){
            let idArr = this.state.idArray;
            let duplicate = idArr.indexOf(id);
            idArr.splice(duplicate, 1);
            this.setState({idArray: idArr});
        }
    }

    renderTableData(){
        if(this.state.contentType === "Users"){
            return this.state.content.map((user, index) => {
                const { _id, firstName, lastName, userName, userRole, phoneNumber } = user
                return(
                    <tr key={_id}>
                        <td><input type='checkbox' id={_id} name={userName} onClick={() => {this.setState({id: _id})}}></input></td>
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
                        <td><input type='checkbox' id={_id} name={name} onClick={() => {this.checkForChecked(_id, name)}}></input></td>
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
                    <tr>
                        <th></th>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Phone Number</th>
                    </tr>
                </thead>
            )
        }
        else{
            return(
                <thead>
                    <tr>
                        <th></th>
                        <th>ID</th>
                        <th>Item Name</th>
                        <th>Description</th>
                        <th>Location</th>
                        <th>Specific Location</th>
                        <th>Serial Number</th>
                        <th>Notes</th>
                    </tr>
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
                <SignItemInOutControls inOrOut={this.state.inOrOut} idArray={this.state.idArray} id={this.state.id} signItemInOutIsVisible={this.state.signItemInOutIsVisible}/>
            </div>
        );
    };
};