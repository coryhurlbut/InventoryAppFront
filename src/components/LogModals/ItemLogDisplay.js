import React from 'react';
import {Modal} from '@fluentui/react';
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
            isOpen: props.isOpen,
            modal: null,
            itemLogIsVisible: props.itemLogIsVisible,
            content: 'ItemLog'
        }
        this.dismissModal = this.dismissModal.bind(this);
    }
    

    componentDidUpdate(prevProps, prevState) {
        if (this.props.itemLogIsVisible !== prevProps.itemLogIsVisible) {
            this.setState({
                itemLogIsVisible: this.props.itemLogIsVisible
            });
        };
        
    };

    dismissModal(){
        this.setState({isOpen: false});
    }

    
    render() {
        return (
            <Modal isOpen={this.state.isOpen}>
                <div>deez</div>
            </Modal>
        ); 
    };
};