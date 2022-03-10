import React                        from 'react';
import ItemEditControls             from './Controls/ItemEditControls';
import UserEditControls             from './Controls/UserEditControls';
import SignItemInOutControls        from './Controls/SignItemInOutControls';
import ItemController               from '../controllers/ItemController';
import UserController               from '../controllers/UserController';
import Table                        from './Table';
import { availableItemsContent, 
    unavailableItemsContent, 
    usersContent }                  from './ContentPresets';
import '../styles/table.css';
import '../styles/App.css';
import '../styles/Modal.css';



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
            btnAI_Active:               false,
            btnUI_Active:               false,
            btnU_Active:                false,
            role:                       props.role
        };
        
        this.showAvailableItems     =   this.showAvailableItems.bind(this);
        this.showUnavailableItems   =   this.showUnavailableItems.bind(this);
        this.showUsers              =   this.showUsers.bind(this);
        this.setIdArray             =   this.setIdArray.bind(this);
    };

    // Will update component props if parent props change
    componentDidUpdate(prevProps, prevState) {
        if (this.props !== prevProps) {
            this.setState({
                userContentIsVisible:       this.props.userContentIsVisible,
                editControlIsVisible:       this.props.editControlIsVisible,
                signItemInOutIsVisible:     this.props.signItemInOutIsVisible,
                role:                       this.props.role
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
            columns:            availableItemsContent.columns,
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
            columns:            unavailableItemsContent.columns,
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
            columns:            usersContent.columns,
            idArray:            [],
            btnAI_Active:       false,
            btnUI_Active:       false,
            btnU_Active:        true
        });
    }

    clearChecks(){
        this.setState({ idArray: [] });
    }

    setIdArray(id) {
        let arr = this.state.idArray;
        if ( arr.includes(id) ) {
            arr = arr.filter(el => el !== id);
        } else {
            arr.push(id);
        };

        this.setState({ idArray: arr });
    }

    buildContentList () {
        if(this.state.content.length === 0){
            return "No content available"
        };

        return(
            <>
            <Table 
                columns={this.state.columns} 
                data={this.state.content} 
                setIdArray={this.setIdArray} 
                userRole={this.state.role} 
                contentType={this.state.contentType} 
            />
            <div id='Table_Modification'>
                {this.buildEditControls()}
                <SignItemInOutControls inOrOut={this.state.inOrOut} idArray={this.state.idArray} id={this.state.id} signItemInOutIsVisible={this.state.signItemInOutIsVisible}/>
            </div>
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
                <UserEditControls idArray={this.state.idArray} role={this.state.role}/>
            );
        };
    };


    render() {
        return (
            <div id='Content_Body'>
                <div id='Table_Navigation'>
                    <button className={ this.state.btnAI_Active ? 'btnSelected' : null} onClick={
                        () => {this.showAvailableItems(); this.clearChecks();}}>
                        Available Items
                    </button>
                    <div className='item_styling'>|</div>
                    <button className={ this.state.btnUI_Active ? 'btnSelected' : null} onClick={
                        () => {this.showUnavailableItems(); this.clearChecks();}}>
                        Unavailable Items
                    </button>
                    {this.state.userContentIsVisible ? <div className='item_styling'>|</div> : null}
                    {this.state.userContentIsVisible ? <button className={ this.state.btnU_Active ? 'btnSelected' : null} 
                        onClick={() => {this.showUsers(); this.clearChecks();}}>Users</button> : null}
                </div>
                
                <div id='Table_Body'>
                    {this.buildContentList()}
                </div>
            </div>
        );
    };
};