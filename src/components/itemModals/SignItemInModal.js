import React                from 'react';

import { Modal }            from '@fluentui/react';

import { itemController,
    itemLogController }     from '../../controllers';
import { ViewNotesModal }   from '../logModals';
import MapNotes             from '../utilities/MapNotes';

/*
*   Modal for signing an item in
*/
export default class SignItemInModal extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen:                 props.isOpen,
            viewNotesModalBool:     null,
            notesArray:             [],
            buttonClicked:          null,
            viewNotesName:          '',

            isError:                false,
            errorMessage:           ''
        };

        this._selectedIds = props.selectedIds;
        this._selectedObjects = props.selectedObjects;
    };

    _dismissModal = () => {
        this.setState({ isOpen: false });
    }

    _signItemsIn = async () => {
        await itemController.signItemIn(this._selectedIds)
        .then( async (auth) => {
            if(auth.status !== undefined && auth.status >= 400) throw auth;
            
            this.setState({ 
                isError:      false,
                errorMessage: ''
            });

            for(let i = 0; i < this._selectedIds.length; i++) {
                let info = {
                    itemId:      this._selectedIds[i],
                    userId:      'test',
                    custodianId: '',
                    action:      'signed in',
                    notes:       'test'
                };
                await itemLogController.createItemLog(info);
            };

            window.location.reload();
            this._dismissModal();
        })
        .catch(async (err) => {            
            //If user trys interacting with the modal before everything can properly load
            //TODO: loading page icon instead of this
            this.setState({ 
                isError: true,
                errorMessage: "An error occured while loading. Please refresh and try again."
            });
        });
    }
    _viewNotesModal = (Event, buttonClicked) => {
        this.setState({ notesArray: MapNotes(buttonClicked),
            viewNotesModalBool: true,
            viewNotesName: Event.target.id});
    }

    /* Loops through the array of items and displays them as a list */
    _displayArray = (items) => {
        const displayItem = items.map((item) => {
            return (
                <span className='displayItemsAndViewNotes'>
                    <li className="arrayObject" key={item.itemNumber}> 
                        {item.itemNumber} : {item.name}
                    </li>
                    <button 
                        type='button'
                        className='signinSignout'
                        key={item._id} 
                        id={item.itemNumber} 
                        onClick={Event => this._viewNotesModal(Event, item.notes)}
                    >
                        View Notes
                    </button>
                </span>
            );
        });

        return <ul>{displayItem}</ul>;
    }

    /* Builds display for deleting items */
    _renderSignInNotification = () => {
        return(
            <>
                <div className="modalHeader">
                    <h3>Sign Item In</h3>
                </div>
                <div className="modalBody">
                    {this.state.isError ?
                        this._renderErrorMessage() :
                        null
                    }
                    <h4>You are about to sign back in:</h4>
                    {this._displayArray(this._selectedObjects)}
                </div>
                <div className="modalFooter">
                    <button onClick={this._signItemsIn}>Submit</button>
                    <button onClick={this._dismissModal}>Close</button>
                </div>
            </>
        );
    }

    /* If a backend issue occurs, display message to user */
    _renderErrorMessage = () => {
        return (
            <label className="errorMessage">
                *{this.state.errorMessage}
            </label>
        );
    };

    render() {
        if(this.state.viewNotesModalBool){
            return(
                <ViewNotesModal 
                    selectedIds={this._selectedIds} 
                    isOpen={true} 
                    hideModal={null} 
                    content={this.state.notesArray} 
                    name={`${this.state.viewNotesName}`} 
                    previousModal={'signIn'} 
                    selectedObjects={this._selectedObjects}
                />
            )
        }else{
            return(
                <Modal isOpen={this.state.isOpen} onDismissed={this.props.hideModal}>
                    {this._renderSignInNotification()}
                </Modal>
            );
        }
    }
}