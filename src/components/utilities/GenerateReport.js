import { Modal } from '@fluentui/react';
import React from 'react';
import { Table } from '../tableStuff';
import {availableItemsColumns} from '../contentPresets';
import { useState } from 'react';
import '../../styles/Modal.css';



const NO_CONTENT = 'No available notes';

const BTN_CLOSE = 'Close';

const GenerateReport = ({items, ...props}) => {
    const [modalIsOpen, setModalIsOpen] = useState(props.isOpen);

    const setModalIsOpenToFalse = () => {
        setModalIsOpen(false);
        props.hideModal();
    }

  return (
    <Modal isOpen={modalIsOpen}>
        <div className='modalHeader'>
            Item Report
        </div>
        <div id='viewItemNotes' className="modalBody">
            {items.length < 1 ? 
                <p className="centerText">{NO_CONTENT}</p> : 
                <Table 
                    columns={availableItemsColumns} 
                    data={items}
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

export default GenerateReport