import React from 'react';
import '@fluentui/react';
import ItemLogController from '../controllers/ItemLogController';

/*
*   Displays log of items signed in and out
*/
export default class ItemLogDisplay extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            itemLogIsVisible: props.itemLogIsVisible,
            content: 'ItemLog'
        };
    };

    buildItemLog () {
        if (this.state.itemLogIsVisible) {
            return(
                <div>
                    {this.state.content}
                </div>
            );
        };
    };
    
    render() {
        return(this.state.itemLogIsVisible ? this.buildItemLog() : null);
    };
};