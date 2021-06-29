import React from 'react';
import '@fluentui/react';
import '../styles/App.css';
import ContentList from './ContentList';
import ItemLogDisplay from './ItemLogDisplay';
import AdminLogDisplay from './AdminLogDisplay';

//Settings for what is to be displayed based on the user's role
const main = {
    userContentIsVisible: false,
    signItemInOutIsVisible: false,
    editControlIsVisible: false,
    allowEditNotes: false,
    isLoggedIn: false,
    itemLogIsVisible: false,
    adminLogIsVisible: false
};
const custodian = {
    userContentIsVisible: false,
    signItemInOutIsVisible: true,
    editControlIsVisible: false,
    allowEditNotes: false,
    isLoggedIn: true,
    itemLogIsVisible: true,
    adminLogIsVisible: false
};
const admin = {
    userContentIsVisible: true,
    signItemInOutIsVisible: true,
    editControlIsVisible: true,
    allowEditNotes: true,
    isLoggedIn: true,
    itemLogIsVisible: true,
    adminLogIsVisible: true
};

/*
*   Builds the page by calling components and passing down what should be visible
*/
export default class ContentBuilder extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            auth: props.auth,
            view: admin //will assign userRole here
        };
    };

    render () {
        let viewState = this.state.view;

        return (
            <div>
                <div className="body">
                    <ContentList 
                        editControlIsVisible={viewState.editControlIsVisible} 
                        userContentIsVisible={viewState.userContentIsVisible} 
                        signItemInOutIsVisible={viewState.signItemInOutIsVisible}
                    />
                    <ItemLogDisplay itemLogIsVisible={viewState.itemLogIsVisible} />
                    <AdminLogDisplay adminLogIsVisible={viewState.adminLogIsVisible} />   
                </div>
            </div>
        );
    };
};