import React                        from 'react';
import ItemEditControls             from './Controls/ItemEditControls';
import UserEditControls             from './Controls/UserEditControls';
import SignItemInOutControls        from './Controls/SignItemInOutControls';
import ItemController               from '../controllers/ItemController';
import UserController               from '../controllers/UserController';
import '../styles/table.css';
import '../styles/App.css';
import '../styles/Modal.css';

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
            idArray:                    [],
            isChecked:                  null,
            btnAI_Active:               false,
            btnUI_Active:               false,
            btnU_Active:                false
        };
        
        this.showAvailableItems     =   this.showAvailableItems.bind(this);
        this.showUnavailableItems   =   this.showUnavailableItems.bind(this);
        this.showUsers              =   this.showUsers.bind(this);
        this.checkForChecked        =   this.checkForChecked.bind(this);
    };

    // Will update component props if parent props change
    componentDidUpdate(prevProps, prevState) {
        if (this.props !== prevProps) {
    
            this.setState({
                userContentIsVisible:       this.props.userContentIsVisible,
                editControlIsVisible:       this.props.editControlIsVisible,
                signItemInOutIsVisible:     this.props.signItemInOutIsVisible,
                id:                         this.props.id,
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
            inOrOut:            availableItemsContent.inOrOut,
            idArray:            [],
            btnAI_Active:       true,
            btnUI_Active:       false,
            btnU_Active:        false
        });
    };

    async showUnavailableItems () {
        let items = await ItemController.getUnavailableItems();
        this.setState({
            content:            items || null,
            contentType:        unavailableItemsContent.contentType,
            editControls:       unavailableItemsContent.editControls,
            inOrOut:            unavailableItemsContent.inOrOut,
            idArray:            [],
            btnAI_Active:       false,
            btnUI_Active:       true,
            btnU_Active:        false
        });
    };

    async showUsers () {
        let users = await UserController.getAllUsers();
        this.setState({
            content:            users || null,
            contentType:        usersContent.contentType,
            editControls:       usersContent.editControls,
            inOrOut:            usersContent.inOrOut,
            idArray:            [],
            btnAI_Active:       false,
            btnUI_Active:       false,
            btnU_Active:        true
        });
    };

    buildContentList () {
        return(
            <>
            <table id='items'>
                    {this.renderTableHeader()}
                <tbody>
                    {this.renderTableData()}
                </tbody>
            </table>
            <div id='Table_Modification'>
                {this.buildEditControls()}
                <SignItemInOutControls inOrOut={this.state.inOrOut} idArray={this.state.idArray} id={this.state.id} signItemInOutIsVisible={this.state.signItemInOutIsVisible}/>
            </div>
            <pre></pre>
            </>
        );
    };

    buildEditControls () {
        if(this.state.editControls === "ItemEditControls" && this.state.editControlIsVisible) {
            return (
                <ItemEditControls idArray={this.state.idArray}/>
            );
        } else if (this.state.editControls === "UserEditControls") {
            return (
                <UserEditControls idArray={this.state.idArray}/>
            );
        };
    };

    checkForChecked (id){
        let idArr = this.state.idArray;
        if(document.getElementById(`${id}`).checked){
            idArr.push(id);
        }else{
            let duplicate = idArr.indexOf(id);
            idArr.splice(duplicate, 1);
        }
        this.setState({ idArray: idArr });
    }

    renderTableData(){
        if(this.state.contentType === "Users"){
            return this.state.content.map((user) => {
                const { _id, firstName, lastName, userName, userRole, phoneNumber } = user
                return(
                    <tr key={_id}>
                        <td><input type='checkbox' id={_id} name={userName} onClick={() => {this.checkForChecked(_id)}}></input></td>
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
            return this.state.content.map((item) => {
                const { _id, name, description, homeLocation, specificLocation, serialNumber, notes } = item
                return(
                    <tr key={_id}>
                        <td><input type='checkbox' id={_id} name={name} onClick={() => {this.checkForChecked(_id)}}></input></td>
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
    };

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
    };

    render() {
        // Check for content and build list if it's present.
        // Otherwise return null
        let contentList = this.state.content !== null ? this.buildContentList() : 'No content available.';

        return (
            <div id='Content_Body'>
                <div id='Table_Navigation'>
                    <button className={ this.state.btnAI_Active ? 'btnSelected' : null} onClick={this.showAvailableItems}>
                        Available Items
                    </button>
                    <div className='item_styling'>|</div>
                    <button className={ this.state.btnUI_Active ? 'btnSelected' : null} onClick={this.showUnavailableItems}>
                        Unavailable Items
                    </button>
                    {this.state.userContentIsVisible ? <div className='item_styling'>|</div> : null}
                    {this.state.userContentIsVisible ? <button className={ this.state.btnU_Active ? 'btnSelected' : null} onClick={this.showUsers}>Users</button> : null}
                </div>
                
                <div id='Table_Body'>
                    {contentList}
                </div>
            </div>
        );
    };
};