import React, { useState } from 'react';
import { Modal }           from '@fluentui/react';
import { Table }           from '../tableStuff';
import { viewNoteColumns } from '../contentPresets';

import '../../styles/Modal.css';

/**
 * A functional component to render a modal displaying notes for a single item using Table component
 */

const NO_CONTENT = 'No available notes';

const BTN_CLOSE = 'Close';

function ViewNoteModal({selectedIds, selectedObjects, content, name, ...props}){
    //useState to dictate modal open state
    const [modalIsOpen, setModalIsOpen] = useState(props.isOpen);

    //TODO -- do not think this modal needs this function, its only here else the Table component breaks
    const _setParentState = (user) => {
        if(selectedIds.includes(user._id)) {
            selectedIds = selectedIds.filter(el => el !== user._id);
            selectedObjects = selectedObjects.filter(object => object._id !== user._id);
        } else {
            selectedIds.push(user._id);
            selectedObjects.push(user);
        };
    }
    //closes modal
    const setModalIsOpenToFalse = () => {
        setModalIsOpen(false);
        props.hideModal();
    }

  return (
    <Modal  isOpen={modalIsOpen}>
        <div className='modalHeader'>
            {/* name is just the selected item name */}
            {name}
        </div>
        <div id='viewItemNotes' className="modalBody">
            {content.length < 1 ? 
                <p className="centerText">{NO_CONTENT}</p> : 
                <Table 
                    columns={viewNoteColumns} 
                    data={content}
                    accountRole={'custodian'}
                    _setParentState={_setParentState}
                />
            }
        </div>
        <div className="modalFooter">
            <button onClick={() => {setModalIsOpenToFalse()}}>
                {BTN_CLOSE}
            </button> 
        </div>
    </Modal>
  )
}

export default ViewNoteModal