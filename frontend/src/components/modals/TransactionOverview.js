import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

function TransactionOverview(props) {
    const deleteTransaction = event => {
        var toChange = event.currentTarget.value
        var newTransactions = props.transactions.map(transaction => {
            if (transaction.id == toChange) {
                transaction.state = ""
            }
            return transaction
        })
        props.change(newTransactions)

    }
    const isNumeric = (str) => {
        if (typeof str != "string") return false // we only process strings!  
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
               !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }
    const editTransaction = event => {
            var toChange = event.currentTarget.dataset.key;
            var newTransactions = props.transactions.map(transaction => {
                if (transaction.id == toChange) {
                    console.log(isNumeric(event.currentTarget.value))
                    if (isNumeric(event.currentTarget.value)) {
                        transaction.amount = parseFloat(event.currentTarget.value)
                    } 
                }
                return transaction
            })
            props.change(newTransactions)
    }
    const moveTransaction = event => {
        var toChange = event.currentTarget.value
        var newTransactions = props.transactions.map(transaction => {
            if (transaction.id == toChange) {
                transaction.state = "unassigned"
            }
            return transaction
        })
        props.change(newTransactions)
    }
    const close = () => {
        props.close()
    }
    var categoryTransactions = props.transactions.filter(card => card.state === props.name)
    return (
        
        <>
        <Modal show={props.show} onHide={props.close} className='.modal-xl'>
            <Modal.Header closeButton>
            <Modal.Title>{props.name}: Transaction overview</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                categoryTransactions.map(element => {
                    return (
                        <div className='grid grid-cols-12'>
                            <div className='col-span-4 flex flex-col justify-center'>{element.name}</div>
                            <div className='col-span-3 flex flex-col justify-center items-center'>{element.date}</div>
                            <div className='col-span-3 flex flex-col justify-center items-center'><input className="border border-solid border-1px border-black w-24 h-7" type="number" defaultValue={element.amount} onChange={editTransaction} data-key={element.id}></input></div>
                            <button className='col-span-1 cursor-pointer' value={element.id} onClick={moveTransaction}><FontAwesomeIcon icon={icon({name: 'arrow-left'})} /></button>
                            {/* <button className='col-span-1 cursor-pointer' value={element.id} onClick={editTransaction}><FontAwesomeIcon icon={icon({name: 'edit'})}/></button> */}
                            <button className='col-span-1 cursor-pointer' value={element.id} onClick={deleteTransaction}><FontAwesomeIcon icon={icon({name: 'trash'})} /></button>
                        </div>
                    )
                })
                }
            </Modal.Body>
            <Modal.Footer>
            <Button variant="primary" onClick={close}>
                Close
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
    }

export default TransactionOverview;