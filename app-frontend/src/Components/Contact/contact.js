import React, { useState, useEffect } from "react";
import ContactService from "../../Services/contactService";
import ClientService from "../../Services/clientService";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Container, Table, Button, Form, Row, Col, Alert, Modal } from 'react-bootstrap';
import { stateCityData } from '../../StateCities';


export default function Contact(){

    /* ===== FORM VALIDATION ===== */

    // form validators
    const validateZipCode = (zipCode) => {
        if( /^\d{5}$/.test(zipCode)){ return true; }
        setValidationErrorOnAdd(validationErrorMessages['Zip']);
        return false;
    };

    const validationErrorMessages = {
        "Phone" : "Phone number must be 10 to 15 digits.",
        "Email" : "Invalid email format.",
        "Zip" : "Zip code must be 5 to 9 digits.",
    }

    /* ===== COMPONENT STATE VARIABLES ===== */

    const [contactList, setContactList] = React.useState([]);
    const [clientList, setClientList] = React.useState([]);

    const [contactListLoaded, setContactListLoaded] = React.useState(true);
    const [contactListLoadErrorMessage, setContactListLoadErrorMessage] = React.useState('');
    
     // add variables
     const [showAddForm, setShowAddForm] = useState(false);
     const [ValidationErrorOnAdd, setValidationErrorOnAdd] = React.useState('');
     const [SuccessMessage, setSuccessMessage] = React.useState('');
     const defaultAddContactValues = {
        firstName: "",
        lastName: "",
        clientId: -1,
        email: "",
        streetAddress: "",
        city: "",
        state: "",
        zip: ""
     };
     const [addContactValues, setAddContactValues] = React.useState(defaultAddContactValues);
     const [contactListUpdated, setContactListUpdated] = React.useState(false);

    // edit variables
    const [showEditForm, setShowEditForm] = useState(false);
    const [ValidationErrorOnEdit, setValidationErrorOnEdit] = React.useState('');
    const defaultPrefillEditForm = {
        personId:-1,
        firstName: '',
        lastName: '',
        clientId: -1,
        email: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: ''
    };
    const [editPrefill, setEditPrefill] = React.useState(defaultPrefillEditForm);

    // view variables
    const [viewContact, setViewContact] = React.useState(false);
    const handleHideContact = () => setViewContact(false);
    const [contactDetails, setContactDetails] = React.useState(defaultPrefillEditForm);
    const [associatedClientName, setAssociatedClientName] = React.useState('');

    //delete variables
    const [errorMessageOnDelete, setErrorMessageOnDelete] = React.useState('');
    const [deleteFailed, setDeleteFailed] = React.useState(false);

    /* ===== COMPONENT CRUD EVENT HANDLERS ===== */

    // add handlers
     const handleShowAddForm = () => {
        setShowAddForm(true);
        setShowEditForm(false);
    }

    const handleAddInputChange = (e) => {
        setAddContactValues({
            ...addContactValues,
            // Trimming any whitespace

            [e.target.name]: e.target.value,
		});
    };

    const handleAddContact = (e) =>{
        e.preventDefault();

        setValidationErrorOnAdd('');
        console.log("HERE");
        console.log(addContactValues);
        if(validateZipCode(addContactValues.zip)){
            ContactService.addContact(addContactValues)
            .then((response)=>{
                    setContactListUpdated(true);
                    setShowAddForm(false);
                    setAddContactValues([]);
                    setSuccessMessage("Contact successfully added.");
                    console.log("Contact added: ", response.data);
                })
                .catch(error=>{
                    // something went wrong alert
                    setValidationErrorOnAdd("Internal Server Error.");
                    console.log(error);
                })
        }
    }

    // edit handlers
    const handleShowEditForm = (contact) => {
        setEditPrefill(contact);
        setShowEditForm(true);
        setShowAddForm(false);
        console.log("EDIT PREFILL:", contact);
    }
    const handleEditInputChange = (e) => {
        setEditPrefill({
            ...editPrefill,
            // Trimming any whitespace

            [e.target.name]: e.target.value,
		});
    };

    const handleEditContact = (e) =>{
        e.preventDefault();

        setValidationErrorOnEdit('');
        console.log("HERE: ", editPrefill);
        if(validateZipCode(editPrefill.zipCode)){
            ContactService.editContact(editPrefill)
            .then((response)=>{
                    setContactListUpdated(true);
                    setShowEditForm(false);
                    setSuccessMessage("Contact successfully edited.");
                    console.log("Contact edited: ", response.data);
                }).catch(error=>{
                    // something went wrong alert
                    setValidationErrorOnEdit("Internal Server Error.");
                    console.log(error);
                })
        }
    }  

    // view handlers
    const handleShowContact = (contact) => {
        setContactDetails(contact);
        setViewContact(true);
        console.log(contact.clientId);
        if(contact.clientId > 0){
            ClientService.getAssociatedClient(contact.clientId)
            .then(function (response) {
                console.log(response.data);
                setAssociatedClientName(response.data.name);
            })  
            .catch(function (error) {
                setValidationErrorOnEdit("Internal Server Error.");
                console.log(error);
            })
        }
    }

    // delete handlers
    const handleDeleteContact = (personId) =>{
        confirmAlert({
            title: 'Confirm Delete',
            message: 'Are you sure that you want to delete this contact?',
            buttons: [
              {
                label: 'Confirm Delete',
                onClick: () => {
                    ContactService.deleteContact(personId)
                        .then((response)=>{ 
                            setContactListUpdated(true);
                            setSuccessMessage("Contact successfully deleted.");
                        }).catch(error=>{
                            setDeleteFailed(true);
                            setErrorMessageOnDelete("Internal Server Error.")
                            console.log("Contact delete failed.");
                        })
                    }
                }
              ]
            });
    };

    /* ===== FETCH ON LOAD AND STATE VARIABLE (clientListUpdated) UPDATE ===== */

    useEffect(()=>{
        ContactService.getContactList()
            .then(function (response) {
                setContactList(response.data);
            })  
            .catch(function (error) {
                console.log(error);
                setContactListLoaded(false);
                setContactListLoadErrorMessage("Error retrieving contacts data.");
            })
    },[contactListUpdated])

    /* ===== FETCH ON LOAD ===== */

    useEffect(()=>{
        ClientService.getClientList()
            .then(function (response) {
                console.log(response.data);
                setClientList(response.data);
            })  
            .catch(function (error) {
                console.log(error);
                setContactListLoaded(false);
                setContactListLoadErrorMessage("Error retrieving client from contact.");
            })
    },[])

    return(
        
        <Container className="mt-4"> 

            {/* ===== COMPONENT ALERTS ===== */}

            {/* success message */}
            {contactListUpdated && SuccessMessage != '' &&
                <Alert variant="success">
                {SuccessMessage}
                </Alert>
            }

            {/* error on contact Add */}
            {ValidationErrorOnAdd != '' &&
                <Alert variant="danger">
                {ValidationErrorOnAdd}
                </Alert>
            }
            
            {/* error on contact edit */}
            {ValidationErrorOnEdit!== '' && 
                <Alert variant="danger">
                {ValidationErrorOnEdit}
                </Alert>
            }
            
            {/* error on client load message */} 
            {!contactListLoaded && contactListLoadErrorMessage !== '' &&
                <Alert variant="danger">
                    {contactListLoadErrorMessage}
                </Alert>
            }

            {/* error on client delete message */} 
            {deleteFailed &&
                <Alert variant="danger">
                    {errorMessageOnDelete}
                </Alert>
            }

            {/* ===== COMPONENT VIEWS ===== */}

            {/* contact detail view */} 
            <Modal show={viewContact} onHide={handleHideContact}>
                <Modal.Header closeButton>
                    <Modal.Title>Client Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Table hover>
                    <thead>
                    </thead>
                    <tbody>
                        <tr>
                            <td><b>Name</b></td>
                            <td>{contactDetails.firstName + " " + contactDetails.lastName}</td>
                        </tr>
                        <tr>
                            <td><b>Email</b></td>
                            <td>{contactDetails.emailAddress}</td>
                        </tr>
                        <tr>
                            <td><b>Address</b></td>
                            <td>{contactDetails.streetAddress + ", " + contactDetails.city + ", " + contactDetails.state + " " + contactDetails.zipCode}</td>
                        </tr>
                        <tr>
                            <td><b>Associated Client</b></td>
                            <td>{associatedClientName!=''? associatedClientName:<p>None</p>}</td>
                        </tr>
                    </tbody>
                </Table>

                </Modal.Body>
            </Modal>
                
            {/* Add form view */}
            {showAddForm && (
            <Container className="text-center">
                <Row className="mb-4">

                    <Col>
                        <div>
                            <h4>Add Contact</h4>
                        </div>
                        <Form onSubmit={handleAddContact}>
                            <Row>
                                <Form.Group as={Row}>
                                    <Form.Label column sm={3}>First Name <span className="text-danger">*</span></Form.Label>
                                    <Col sm={6}>
                                        <Form.Control type="text" name="firstName" placeholder="First Name" value={addContactValues.firstName} onChange={handleAddInputChange} required/>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm={3}>Last Name <span className="text-danger">*</span></Form.Label>
                                    <Col sm={6}>
                                        <Form.Control type="text" name="lastName" placeholder="Last Name" value={addContactValues.lastName} onChange={handleAddInputChange} required/>
                                    </Col>                            
                                </Form.Group>

                                <Form.Group as={Row}>
                                <Form.Label column sm={3}>Associate a Client</Form.Label>
                                <Col sm={6}>
                                    <Form.Control as="select" name="clientId" value={addContactValues.clientId} onChange={handleAddInputChange}required>
                                            <option value="-1">No Selection</option>
                                            {Object.values(clientList).length !== 0 && Object.values(clientList).map((client) => (
                                                <option value={client.clientId}>
                                                {client.name}
                                                </option>
                                            ))}
                                        </Form.Control>
                                </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                <Form.Label column sm={3}>Email Address <span className="text-danger">*</span></Form.Label>
                                <Col sm={6}>
                                    <Form.Control type="email" name="email" placeholder="Email Address" value={addContactValues.email} onChange={handleAddInputChange}required/>
                                </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                <Form.Label column sm={3}>Street Address <span className="text-danger">*</span></Form.Label>
                                <Col sm={6}>
                                    <Form.Control type="text" name="streetAddress" placeholder="Street Address" value={addContactValues.streetAddress} onChange={handleAddInputChange} required/>
                                </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm={3}>State <span className="text-danger">*</span></Form.Label>
                                    <Col sm={6}>
                                        <Form.Control as="select" name="state" value={addContactValues.state} onChange={handleAddInputChange} required>
                                            <option value="">Select a State</option>
                                            {Object.keys(stateCityData).map((state) => (
                                                <option key={state} value={state}>
                                                {state}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm={3}>City <span className="text-danger">*</span></Form.Label>
                                    <Col sm={6}>
                                        <Form.Control as="select" name="city" value={addContactValues.city} onChange={handleAddInputChange} disabled={addContactValues.state==""} required>
                                        <option value="">Select a City</option>
                                            {addContactValues.state &&
                                                stateCityData[addContactValues.state].map((city) => (
                                                <option key={city} value={city}>
                                                    {city}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm={3}>Zip <span className="text-danger">*</span></Form.Label>
                                    <Col sm={6}><Form.Control type="text" name="zip" placeholder="Zip" value={addContactValues.zip} onChange={handleAddInputChange} required/></Col>
                                </Form.Group>
                            </Row>
                            
                            <Col className="mt-3">
                                <Button variant="primary" type="submit">Submit</Button>{' '}
                                <Button variant="outline-secondary" onClick={() => setShowAddForm(false)}>Cancel</Button>
                            </Col>
                        </Form>
                    </Col>
                </Row>
            </Container>
            )}   

            {/* edit form view */}   
            {showEditForm && !showAddForm && (
            <Container className="text-center">
                <Row className="mb-4">
                    <Col>
                        <div>
                            <h4>Edit Contact</h4>
                        </div>
                        <Form onSubmit={handleEditContact}>
                        <Row>
                                <Form.Group as={Row}>
                                    <Form.Label column sm={3}>First Name <span className="text-danger">*</span></Form.Label>
                                    <Col sm={6}>
                                        <Form.Control type="text" name="firstName" placeholder="First Name" value={editPrefill.firstName} onChange={handleEditInputChange} required/>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm={3}>Last Name <span className="text-danger">*</span></Form.Label>
                                    <Col sm={6}>
                                        <Form.Control type="text" name="lastName" placeholder="Last Name" value={editPrefill.lastName} onChange={handleEditInputChange} required/>
                                    </Col>                            
                                </Form.Group>

                                <Form.Group as={Row}>
                                <Form.Label column sm={3}>Associate a Client</Form.Label>
                                <Col sm={6}>
                                    <Form.Control as="select" name="clientId" value={editPrefill.clientId} onChange={handleEditInputChange}required>
                                            <option value="-1">No Selection</option>
                                            {Object.values(clientList).length !== 0 && Object.values(clientList).map((client, index) => (
                                                <option key={index} value={client.clientId}>
                                                {client.name}
                                                </option>
                                            ))}
                                        </Form.Control>
                                </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                <Form.Label column sm={3}>Email Address <span className="text-danger">*</span></Form.Label>
                                <Col sm={6}>
                                    <Form.Control type="email" name="email" placeholder="Email Address" value={editPrefill.emailAddress} onChange={handleEditInputChange} required/>
                                </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                <Form.Label column sm={3}>Street Address <span className="text-danger">*</span></Form.Label>
                                <Col sm={6}>
                                    <Form.Control type="text" name="streetAddress" placeholder="Street Address" value={editPrefill.streetAddress} onChange={handleEditInputChange} required/>
                                </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm={3}>State <span className="text-danger">*</span></Form.Label>
                                    <Col sm={6}>
                                        <Form.Control as="select" name="state" value={editPrefill.state} onChange={handleEditInputChange} required>
                                            <option value="">Select a State</option>
                                            {Object.keys(stateCityData).map((state, index) => (
                                                <option key={index} value={state}>
                                                {state}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm={3}>City <span className="text-danger">*</span></Form.Label>
                                    <Col sm={6}>
                                        <Form.Control as="select" name="city" value={editPrefill.city} onChange={handleEditInputChange} disabled={editPrefill.state==""} required>
                                        <option value="">Select a City</option>
                                            {stateCityData[editPrefill.state].map((city, index) => (
                                                <option key={index} value={city}>
                                                    {city}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm={3}>Zip <span className="text-danger">*</span></Form.Label>
                                    <Col sm={6}><Form.Control type="text" name="zipCode" placeholder="Zip" value={editPrefill.zipCode} onChange={handleEditInputChange} required/></Col>
                                </Form.Group>
                            </Row>
                            
                            <Col className="mt-3">
                                <Button variant="primary" type="submit">Submit</Button>{' '}
                                <Button variant="outline-secondary" onClick={() => setShowEditForm(false)}>Cancel</Button>
                            </Col>
                        </Form>
                    </Col>
                </Row>
            </Container>
            )}

            {/* contact list table view */}
            <Row className="mb-4">
                <Col>
                    <Button variant="primary" onClick={handleShowAddForm}>
                        New Entry
                    </Button>
                    <Table striped bordered hover className="mt-4">
                        <thead>
                            <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(contactList).length !== 0? Object.values(contactList).map((contact, index) => {
                                return (
                                    <tr key={index}>
                                    <td>{contact['firstName'] + " " + contact['lastName']}</td>
                                    <td>{contact['emailAddress']}</td>
                                    <td>
                                        <Button variant="info" onClick={() => handleShowContact(contact)}>View</Button>{' '}
                                        <Button variant="secondary" onClick={() => handleShowEditForm(contact)}>Edit</Button>{' '}
                                        <Button variant="danger" onClick={() => handleDeleteContact(contact.personId)}>Delete</Button> 
                                    </td>
                                </tr>
                                );
                            }): null}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            
        </Container>
    );
}