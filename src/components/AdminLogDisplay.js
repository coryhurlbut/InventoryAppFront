import React from 'react';
import '@fluentui/react';
import AdminLogController from '../controllers/AdminLogController';

/*
*   Displays log of admin actions (add, edit, delete of items and users)
*/
export default class AdminLogDisplay extends React.Component {
    constructor(props){
        super(props)
        //ToDo: Build out AdminLog functionality
        this.state = {
            adminLogIsVisible: props.adminLogIsVisible,
            content: 'AdminLog'
        };
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.props.adminLogIsVisible !== prevProps.adminLogIsVisible) {
            this.setState({
                adminLogIsVisible: this.props.adminLogIsVisible
            });
        };
    };

    buildAdminLog () {
        return(
            <div>
                {this.state.content}
            </div>
        );
    };
    
    render() {
        return(this.state.adminLogIsVisible ? this.buildAdminLog() : null);
    };
};