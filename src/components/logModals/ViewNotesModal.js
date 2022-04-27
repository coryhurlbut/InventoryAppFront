import React               from "react";
import { Modal }           from "@fluentui/react";
import {Table}                    from '../tableStuff';
import EditItemModal       from "../itemModals/EditItemModal";
import { SignItemInModal, SignItemOutModal } from "../itemModals";
import '../../styles/Modal.css'

const columns = [
    {
        Header: "Notes",
        accessor: "notes"
    },
    {
        Header: "Date",
        accessor: 'date'
    }
]

export default class ViewNotesModal extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isOpen:             props.isOpen,
            hideModal:          props.hideModal,
            content:            props.content,
            name:               props.name,
            viewOtherModalBool: null,
            previousModal:      props.previousModal
        }
        this._setParentState = this._setParentState.bind(this);
        this._selectedIds = props.selectedIds;
        this._selectedObjects = props.selectedObjects;
    }

    _viewOtherModal = () => {
        this.setState({ viewOtherModalBool: true });
    }
    
    _setParentState = (user) => {
        let arr = this.state.selectedIds;
        let selectedObjects = this.state.selectedObjects;
        if(arr.includes(user._id)) {
            arr = arr.filter(el => el !== user._id);
            selectedObjects = selectedObjects.filter(object => object._id !== user._id);
        } else {
            arr.push(user._id);
            selectedObjects.push(user);
        };
        this.setState({ selectedIds: arr, selectedObjects: selectedObjects });
    }

    render(){
        if(this.state.viewOtherModalBool){
            switch(this.state.previousModal){
                case 'editItem':
                    return(
                        <EditItemModal 
                            isOpen
                            hideModal={this.hideModal}
                            selectedIds={this._selectedIds} 
                            selectedObjects={this.state.selectedObjects}
                            reload={true}
                        />
                    );
                case 'signIn':
                    return(
                        <SignItemInModal 
                            isOpen
                            hideModal={this.hideModal}
                            selectedIds={this._selectedIds} 
                            selectedObjects={this._selectedObjects} 
                        />
                    );
                case 'signOut':
                    return(
                        <SignItemOutModal 
                            isOpen
                            hideModal={this.hideModal}
                            selectedIds={this._selectedIds} 
                            selectedObjects={this._selectedObjects} 
                        />
                    );
                default:
                    break;
            }
        }
        else{
            return(
                
                <Modal  isOpen={this.state.isOpen}>
                    <div className='modalHeader'>
                        {this.state.name}
                    </div>
                    <div id='viewItemNotes'className="modalBody">
                        {this.state.content.length <= 1 ? 
                            'This item has no notes' : 
                            <Table 
                                columns={columns} 
                                data={this.state.content}
                                accountRole={'custodian'}
                                _setParentState={this._setParentState}
                            />
                        }
                    </div>
                    <div className="modalFooter">
                        <button onClick={() => {this._viewOtherModal()}}>
                            Close
                        </button> 
                    </div>
                </Modal>
            )
        }
    }
}