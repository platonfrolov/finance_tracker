import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function EditTransactionAmount(props) {
    const save = () => {
        props.change(props.name, document.querySelector("#newName").value)
        props.close()
    }
    const cancel = () => {
        props.close()
    }
    return (
        <>
        <Modal show={props.show} onHide={props.close}>
            <Modal.Header closeButton>
            <Modal.Title>{props.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Enter the new amount:
                <input id="newName" type='text'></input>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={cancel}>
                Cancel
            </Button>
            <Button variant="primary" onClick={save}>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
    }

export default EditTransactionAmount;