import React from 'react';
import '@fluentui/react';
// import ItemLogController from '../controllers/ItemLogController';

/*
*   Displays log of items signed in and out
*/
export default class ItemLogDisplay extends React.Component {
    constructor(props){
        super(props);
        //ToDo: Build out CustodianLog functionality
        this.state = {
            itemLogIsVisible: props.itemLogIsVisible,
            content: 'ItemLog'
        };
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.props.itemLogIsVisible !== prevProps.itemLogIsVisible) {
            this.setState({
                itemLogIsVisible: this.props.itemLogIsVisible
            });
        };
    };

    buildItemLog () {
        return (
            <div>
                {this.state.content}
            </div>
        );
    };
    
    render() {
        return(this.state.itemLogIsVisible ? this.buildItemLog() : null);
    };
};