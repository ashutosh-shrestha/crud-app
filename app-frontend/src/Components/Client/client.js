import React, { useState, useEffect } from "react";
import ClientService from "../../Services/clientService";
import ContactService from "../../Services/contactService";
import { stateCityData } from '../../StateCities';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { Eye, Search, Trash, PencilSquare, PlusCircle } from 'react-bootstrap-icons';


import { Container, Table, Button, Form, Row, Col, InputGroup, ListGroup, Modal, Alert } from 'react-bootstrap';

export default function Client(){

    /* ===== FORM VALIDATION ===== */

    const validatePhone = (phone) => {
        if(/^\d{10,15}$/.test(phone)){ return true; }
        setValidationErrorOnAdd(validationErrorMessages['Phone']);
        return false;
    };
    
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

    // get client and contact list data
    const [clientList, setClientList] = React.useState([]);
    const [clientListLoaded, setClientListLoaded] = React.useState(true);
    const [clientListLoadErrorMessage, setClientListLoadErrorMessage] = React.useState('');
    const [associatedContacts, setAssociatedContacts] = React.useState([{}]);
    const [unassociatedContacts, setUnassociatedContacts] = React.useState([]);


    // add variables
    const [showAddForm, setShowAddForm] = useState(false);
    const [addContactList, setAddContactList] = useState([]);
    const [ValidationErrorOnAdd, setValidationErrorOnAdd] = React.useState('');
    const [SuccessMessage, setSuccessMessage] = React.useState('');
    const defaultAddClientValues = {
        name: "",
        website: "",
        phone: "",
        streetAddress: "",
        city: "",
        state: "",
        zip: ""
    };
    const [addClientValues, setAddClientValues] = React.useState(defaultAddClientValues);
    const [clientListUpdated, setClientListUpdated] = React.useState(false);
    const animatedComponents = makeAnimated();
    

    // edit variables
    const [showEditForm, setShowEditForm] = useState(false);
    const [editAddContactList, setEditAddContactList] = useState([]);
    const [editDeleteContactList, setEditDeleteContactList] = useState([]);
    const [ValidationErrorOnEdit, setValidationErrorOnEdit] = React.useState('');
    const defaultPrefillEditForm = {
        clientid:-1,
        name: "",
        website: "",
        phone: 0,
        streetAddress: "",
        city: "",
        state: "",
        zip: ""
    };
    const [editPrefill, setEditPrefill] = React.useState(defaultPrefillEditForm);

    // view variables
    const [viewClient, setViewClient] = React.useState(false);
    const [associatedContactsView, setAssociatedContactsView] = React.useState([]);
    const handleHideClient = () => setViewClient(false);
    const [clientDetails, setClientDetails] = React.useState(defaultPrefillEditForm);
    // Inline style for the scrollable list
    const scrollableStyle = { maxHeight: '100px', overflowY: 'auto'};

    //delete variables
    const [errorMessageOnDelete, setErrorMessageOnDelete] = React.useState('');
    const [deleteFailed, setDeleteFailed] = React.useState(false);


    const [searchText, setSearchText] = useState('');

    /* ===== COMPONENT CRUD EVENT HANDLERS ===== */

    // add handlers
    const handleShowAddForm = () => {
        console.log(addClientValues);
        setShowAddForm(true);
        setShowEditForm(false);
    }

    const handleAddInputChange = (e) => {
        setAddClientValues({
            ...addClientValues,
            // Trimming any whitespace

            [e.target.name]: e.target.value,
		});
    };

    const handleAddContactSelectChange = (selectedOption) => {
        const selectedContacts = selectedOption.map(obj => obj.value);
        setAddContactList(selectedContacts);
    };

    const handleAddClient = (e) =>{
        e.preventDefault();
        setClientListUpdated(false);
        clearFormValidationMessages();

        setValidationErrorOnAdd('');
        if(validatePhone(addClientValues.phone) && validateZipCode(addClientValues.zip)){
            ClientService.addClient(addClientValues, addContactList)
            .then((response)=>{
                    setClientListUpdated(true);
                    setShowAddForm(false);
                    setAddClientValues(defaultAddClientValues);
                    setSuccessMessage("Client successfully added.");
                })
                .catch(error=>{
                    // something went wrong alert
                    setValidationErrorOnAdd(error.response.data);
                    console.log(error);
                })
        }
    }


    // edit handlers
    const handleShowEditForm = (client) => {
        setShowEditForm(true);
        setShowAddForm(false);
        setEditPrefill(client);
        let filteredData = [];
        ContactService.getAssociatedContacts(client.clientId)
            .then(function (response) {
                const a_ContactsData = response.data;
                a_ContactsData.map(Contact => filteredData.push({'value': Contact['personId'], 'label': Contact['firstName'] + " " + Contact['lastName']}));

                setAssociatedContacts(filteredData);
            })  
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            }); 
    }
    const handleEditInputChange = (e) => {
        setEditPrefill({
            ...editPrefill,
            // Trimming any whitespace

            [e.target.name]: e.target.value,
		});
    };

    const handleEditAddContactSelectChange = (selectedOption) => {
        const selectedContacts = selectedOption.map(obj => obj.value);
        setEditAddContactList(selectedContacts);
    };

    const handleEditDeleteContactSelectChange = (selectedOption) => {
        const selectedContacts = selectedOption.map(obj => obj.value);
        setEditDeleteContactList(selectedContacts);
    };

    const handleEditClient = (e) =>{
        e.preventDefault();
        setValidationErrorOnEdit('');
        setClientListUpdated(false);
        clearFormValidationMessages();

        if(validatePhone(editPrefill.phone) && validateZipCode(editPrefill.zipCode)){
            ClientService.editClient(editPrefill, editAddContactList, editDeleteContactList)
            .then((response)=>{
                    setClientListUpdated(true);
                    setShowEditForm(false);
                    setSuccessMessage("Client successfully edited.");
                }).catch(error=>{
                    // something went wrong alert
                    setValidationErrorOnEdit(error.response.data);
                    console.log(error);
                })
        }
    }  

    
    // view handlers
    const handleShowClient = (client) => {
        setClientDetails(client);
        setViewClient(true);
        ContactService.getAssociatedContacts(client.clientId)
            .then(function (response) {
                let filteredViewData = [];

                const a_ContactsData = response.data;
                a_ContactsData.map(Contact => filteredViewData.push({'value': Contact['personId'], 'label': Contact['firstName'] + " " + Contact['lastName']}));

                setAssociatedContactsView(filteredViewData);
            })  
            .catch(function (error) {
                setValidationErrorOnEdit("Internal Server Error.");
                console.log(error);            
            }) 
    }
    

    // delete handlers
    const handleDeleteClient = (clientId) =>{
        setClientListUpdated(false);
        clearFormValidationMessages();

        confirmAlert({
            title: 'Confirm Delete',
            message: 'Deleting a Client will also remove its association with all Contacts permanently. Are you sure that you want to delete this client?',
            buttons: [
              {
                label: 'Confirm Delete',
                onClick: () => {
                    ClientService.deleteClient(clientId)
                        .then(()=>{ 
                            setClientListUpdated(true);
                            setSuccessMessage("Client successfully deleted.");
                        }).catch(error=>{
                            setDeleteFailed(true);
                            setErrorMessageOnDelete("Internal Server Error.")
                            console.log(error);
                        })
                    }
                }
              ]
            });
    };


    const handleSearchInputChange = (e) => {
        setSearchText(e.target.value);
      };
    
      const handleSearchSubmit = (e) => {
        e.preventDefault();
        ClientService.getClientListByName(searchText)
            .then(function (response) {
                setClientList(response.data);
            })  
            .catch(function (error) {
                console.log(error);
                setClientListLoaded(false);
                setClientListLoadErrorMessage("Error retrieving search client data.");
            })
      };

    const clearFormValidationMessages = () =>{
        setValidationErrorOnAdd('');
        setValidationErrorOnEdit('');
        setErrorMessageOnDelete('');
        setSuccessMessage('');
    }
    
    /* ===== FETCH ON LOAD AND STATE VARIABLE (clientListUpdated) UPDATE ===== */

    useEffect(()=>{
        ClientService.getClientList()
            .then(function (response) {
                setClientList(response.data);
            })  
            .catch(function (error) {
                console.log(error);
                setClientListLoaded(false);
                setClientListLoadErrorMessage("Error retrieving client data.");
            })

        let filteredData = [];
        ContactService.getUnassociatedContacts()
            .then(function (response) {
                const data = response.data;
                data.map(Contact => filteredData.push({'value': Contact['personId'], 'label': Contact['firstName'] + " " + Contact['lastName']}));
                setUnassociatedContacts(filteredData);
            })  
            .catch(function (error) {
                console.log(error);
                setClientListLoaded(false);
                setClientListLoadErrorMessage("Error retrieving associated contact data.");
            })
    },[clientListUpdated])
    
    return(
        <Container className="mt-4"> 

            <h3 className="text-center"><b>Clients</b></h3>

            {/* ===== COMPONENT ALERTS ===== */}

            {/* success message */}
            {clientListUpdated && SuccessMessage != '' &&
                <Alert variant="success">
                {SuccessMessage}
                </Alert>
            }

            {/* error on client add */}
            {ValidationErrorOnAdd != '' &&
                <Alert variant="danger">
                {ValidationErrorOnAdd}
                </Alert>
            }

            {/* error on client edit */}
            {ValidationErrorOnEdit !== '' && 
                <Alert variant="danger">
                {ValidationErrorOnEdit}
                </Alert>
            }
            
            {/* error on client load message */} 
            {!clientListLoaded && clientListLoadErrorMessage !== '' &&
                <Alert variant="danger">
                    {clientListLoadErrorMessage}
                </Alert>
            }

            {/* error on client delete message */} 
            {deleteFailed &&
                <Alert variant="danger">
                    {errorMessageOnDelete}
                </Alert>
            }

            {/* ===== COMPONENT VIEWS ===== */}

            <Form onSubmit={handleSearchSubmit}>
                <InputGroup className="mb-3">
                    <Form.Control
                        placeholder="Search by name..."
                        aria-label="Search"
                        value={searchText}
                        onChange={handleSearchInputChange}
                    />
                    <Button variant="outline-secondary" type="submit">
                        <Search/>{' '}<span className="hide-on-small-screen" >Search</span>
                    </Button>
                </InputGroup>
            </Form>

            {/* client detail view */} 
            <Modal show={viewClient} onHide={handleHideClient}>
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
                            <td>{clientDetails.name}</td>
                        </tr>
                        <tr>
                            <td><b>Company Site</b></td>
                            <td>{clientDetails.companyURI}</td>
                        </tr>
                        <tr>
                            <td><b>Phone</b></td>
                            <td>{clientDetails.phone}</td>
                        </tr>
                        <tr>
                            <td><b>Address</b></td>
                            <td>{clientDetails.streetAddress + ", " + clientDetails.city + ", " + clientDetails.state + " " + clientDetails.zipCode}</td>
                        </tr>
                    </tbody>
                </Table>
                {Object.keys(associatedContactsView).length !== 0? <b>Associated Contacts</b>:<b>Associated Contacts: 0</b>}
                {Object.keys(associatedContactsView).length !== 0 ? (
                    <ListGroup style={scrollableStyle}>
                        {Object.values(associatedContactsView).map((contact, index) => (
                        <ListGroup.Item key={index}>{contact.label}</ListGroup.Item> // Key moved here
                        ))}
                    </ListGroup>
                ) : null}

                </Modal.Body>
            </Modal>

            {/* add form view */}
            {showAddForm && !showEditForm && (
            <Container className="text-center">
                <Row className="mb-4">

                    <Col>
                        <div>
                            <h4>Add Client</h4>
                        </div>
                        <Form onSubmit={handleAddClient}>
                            <Row>
                                <Form.Group as={Row}  className="mt-2">
                                    <Form.Label column sm={3} className="hide-on-small-screen">Name <span className="text-danger">*</span></Form.Label>
                                    <Col sm={6}>
                                    <Form.Control type="text" name="name" placeholder="Name" value={addClientValues.name} onChange={handleAddInputChange} required/>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}  className="mt-2">
                                    <Form.Label column sm={3} className="hide-on-small-screen">Phone <span className="text-danger">*</span></Form.Label>
                                    <Col sm={6}>
                                        <Form.Control type="text" name="phone" placeholder="Phone" value={addClientValues.phone} onChange={handleAddInputChange} required/>
                                    </Col>                            
                                </Form.Group>

                                <Form.Group as={Row} className="mt-2">
                                    <Form.Label column sm={3} className="hide-on-small-screen">Website URI <span className="text-danger">*</span></Form.Label>
                                    <Col sm={6}>
                                        <Form.Control type="url" name="website" placeholder="Website URI" value={addClientValues.website} onChange={handleAddInputChange} required/>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mt-2">
                                    <Form.Label column sm={3}>Add Contact</Form.Label>
                                    <Col sm={6}>
                                        <Select
                                            closeMenuOnSelect={false}
                                            components={animatedComponents}
                                            isMulti
                                            options={unassociatedContacts}
                                            onChange={handleAddContactSelectChange}
                                        />

                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}  className="mt-2">
                                <Form.Label column sm={3} className="hide-on-small-screen">Street Address <span className="text-danger">*</span></Form.Label>
                                <Col sm={6}>
                                <Form.Control type="text" name="streetAddress" placeholder="Street Address" value={addClientValues.streetAddress} onChange={handleAddInputChange} required/>
                                </Col>
                                </Form.Group>

                                <Form.Group as={Row}  className="mt-2">
                                    <Form.Label column sm={3} className="hide-on-small-screen">State <span className="text-danger">*</span></Form.Label>
                                    <Col sm={6}>
                                        <Form.Control as="select" name="state" value={addClientValues.state} onChange={handleAddInputChange} required>
                                            <option value="">Select a State</option>
                                            {Object.keys(stateCityData).map((state) => (
                                                <option key={state} value={state}>
                                                {state}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}  className="mt-2">
                                    <Form.Label column sm={3} className="hide-on-small-screen">City <span className="text-danger">*</span></Form.Label>
                                    <Col sm={6}>
                                        <Form.Control as="select" name="city" value={addClientValues.city} onChange={handleAddInputChange} disabled={addClientValues.state==""} required>
                                            <option value="">Select a City</option>
                                            {addClientValues.state &&
                                                stateCityData[addClientValues.state].map((city) => (
                                                <option key={city} value={city}>
                                                    {city}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}  className="mt-2">
                                    <Form.Label column sm={3} className="hide-on-small-screen">Zip <span className="text-danger">*</span></Form.Label>
                                    <Col sm={6}><Form.Control type="text" name="zip" placeholder="Zip" value={addClientValues.zip} onChange={handleAddInputChange} required /></Col>
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
                            <h4>Edit Client</h4>
                        </div>
                        <Form onSubmit={handleEditClient}>
                            <Row>
                                <Form.Group as={Row}  className="mt-2">
                                    <Form.Label column sm={3} className="hide-on-small-screen">Name <span className="text-danger">*</span></Form.Label>
                                    <Col sm={6}>
                                    <Form.Control type="text" name="name" placeholder="Name" value={editPrefill.name} onChange={handleEditInputChange} required/>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}  className="mt-2">
                                    <Form.Label column sm={3} className="hide-on-small-screen">Phone <span className="text-danger">*</span></Form.Label>
                                    <Col sm={6}>
                                        <Form.Control type="text" name="phone" placeholder="Phone" value={editPrefill.phone} onChange={handleEditInputChange} required/>
                                    </Col>                            
                                </Form.Group>

                                <Form.Group as={Row}  className="mt-2">
                                <Form.Label column sm={3} className="hide-on-small-screen">Website URI <span className="text-danger">*</span></Form.Label>
                                <Col sm={6}>
                                    <Form.Control type="url" name="website" placeholder="Website URI" value={editPrefill.companyURI} onChange={handleEditInputChange} required/>
                                </Col>
                                </Form.Group>

                                <Form.Group as={Row}  className="mt-2">
                                    <Form.Label column sm={3}>Add Contact</Form.Label>
                                    <Col sm={6}>
                                        <Select
                                            closeMenuOnSelect={false}
                                            components={animatedComponents}
                                            isMulti
                                            options={unassociatedContacts}
                                            onChange={handleEditAddContactSelectChange}
                                        />

                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}  className="mt-2">
                                    <Form.Label column sm={3} className="hide-on-small-screen">Delete Contact</Form.Label>
                                    <Col sm={6}>
                                        <Select
                                            closeMenuOnSelect={false}
                                            components={animatedComponents}
                                            isMulti
                                            options={associatedContacts}
                                            onChange={handleEditDeleteContactSelectChange}
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}  className="mt-2">
                                <Form.Label column sm={3} className="hide-on-small-screen">Street Address <span className="text-danger">*</span></Form.Label>
                                <Col sm={6}>
                                <Form.Control type="text" name="streetAddress" placeholder="Street Address" value={editPrefill.streetAddress} onChange={handleEditInputChange} required/>
                                </Col>
                                </Form.Group>

                                <Form.Group as={Row}  className="mt-2">
                                    <Form.Label column sm={3} className="hide-on-small-screen">State <span className="text-danger">*</span></Form.Label>
                                    <Col sm={6}>
                                        <Form.Control as="select" name="state" value={editPrefill.state} onChange={handleEditInputChange} required>
                                            <option value="">Select a State</option>
                                            {Object.keys(stateCityData).map((state) => (
                                                <option key={state} value={state}>
                                                {state}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}  className="mt-2">
                                    <Form.Label column sm={3} className="hide-on-small-screen">City <span className="text-danger">*</span></Form.Label>
                                    <Col sm={6}>
                                        <Form.Control as="select" name="city" value={editPrefill.city} onChange={handleEditInputChange} disabled={editPrefill.state==""} required>
                                            <option value="">Select a City</option>
                                            {editPrefill.state &&
                                                stateCityData[editPrefill.state].map((city) => (
                                                <option key={city} value={city}>
                                                    {city}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}  className="mt-2">
                                    <Form.Label column sm={3} className="hide-on-small-screen">Zip <span className="text-danger">*</span></Form.Label>
                                    <Col sm={6}><Form.Control type="text" name="zip" placeholder="Zip" value={editPrefill.zipCode} onChange={handleEditInputChange} required /></Col>
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

            {/* client list table view */}   
            <Row className="mb-4" >
                <Col>
                    <Button variant="primary" onClick={handleShowAddForm}>
                        <PlusCircle/>{' '}New Entry
                    </Button>
                    <Table striped bordered className="mt-4">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                            <tbody >
                                {Object.keys(clientList).length !== 0? Object.values(clientList).map((client, index) => {
                                    return (
                                        <tr key={index}>
                                        <td>{client['name']}</td>
                                        <td>{client['phone']}</td>
                                        <td className="text-center">
                                            <Button variant="info" onClick={() => handleShowClient(client)}><Eye/>{' '}<span className="hide-on-small-screen">View</span></Button>{' '}
                                            <Button variant="secondary" onClick={() => handleShowEditForm(client)}><PencilSquare/>{' '}<span className="hide-on-small-screen">Edit</span></Button>{' '}
                                            <Button variant="danger" onClick={() => handleDeleteClient(client.clientId)}><Trash/>{' '}<span className="hide-on-small-screen">Delete</span></Button>    
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