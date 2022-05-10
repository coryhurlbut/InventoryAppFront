import React, { useState } from 'react';
import { Modal } from '@fluentui/react';
import { Table } from '../tableStuff';

import '../../styles/Modal.css';

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

const NO_CONTENT = 'No available notes';

const BTN_CLOSE = 'Close';

function ViewNoteModal({selectedIds, selectedObjects, content, name, ...props}){
    const [modalIsOpen, setModalIsOpen] = useState(props.isOpen);

    const _setParentState = (user) => {
        if(selectedIds.includes(user._id)) {
            selectedIds = selectedIds.filter(el => el !== user._id);
            selectedObjects = selectedObjects.filter(object => object._id !== user._id);
        } else {
            selectedIds.push(user._id);
            selectedObjects.push(user);
        };
    }
    const setModalIsOpenToFalse = () => {
        setModalIsOpen(false);
        props.hideModal();
    }

  return (
    <Modal  isOpen={modalIsOpen}>
        <div className='modalHeader'>
            {name}
        </div>
        <div id='viewItemNotes'className="modalBody">
            {content.length < 1 ? 
                <p className="centerText">{NO_CONTENT}</p> : 
                <Table 
                    columns={columns} 
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