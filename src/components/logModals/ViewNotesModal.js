import React     from "react";
import { Modal } from "@fluentui/react";
import Table     from "../Table";
import '../../styles/Modal.css'

const columns = [
    {
        Header: "Notes",
        accessor: "notes"
    }
]

export default class ViewNotesModal extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isOpen:     props.isOpen,
            hideModal:  props.hideModal,
            content:    props.content,
            name:       props.name
        }
        this._setParentState = this._setParentState.bind(this);
    }
    _dismissModal(){
        this.setState({ isOpen: false });
        window.location.reload();
    }
    _setParentState(user) {
        let arr = this.state.idArray;
        let selectedObjects = this.state.selectedObjects;
        if(arr.includes(user._id)) {
            arr = arr.filter(el => el !== user._id);
            selectedObjects = selectedObjects.filter(object => object._id !== user._id);
        } else {
            arr.push(user._id);
            selectedObjects.push(user);
        };
        this.setState({ idArray: arr, selectedObjects: selectedObjects });
    }

    render(){
        return(
            <Modal isOpen={this.state.isOpen}>
                <div className='modalHeader'>{this.state.name}</div>
                <div className="modalBody">
                    <Table 
                        columns={columns} 
                        data={this.state.content} 
                        contentType={'deez'} 
                        role={'custodian'}
                        _setParentState={this._setParentState}
                    />
                </div>
                <div className="modalFooter">
                <button onClick={() => {this._dismissModal()}}>Close</button> 
                </div>
            </Modal>
        )
    }
}