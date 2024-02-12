import React from 'react';
import { Container, ListGroup } from 'react-bootstrap';

export default function Main() {
  const colors = [, , , , , , , ]; // Example colors

  return (
    <Container>
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <h3 className="home-text-hello"> Hello!</h3>
            <h3 className="home-text-welcome"> Welcome to Aquent CRUD App!</h3>
            
          </div>
        </div>
      </div>
      <h4 className="mt-4 text-center">Project details</h4>

      <ListGroup className="mb-4">
        <ListGroup.Item style={{ backgroundColor: '#9bf6ff' }}><b>Basic CRUD operations</b> for Clients and Contacts work smoothly.</ListGroup.Item>
        <ListGroup.Item style={{ backgroundColor: '#ffd6a5' }}>You can <b>add or/and delete multiple contacts</b> from a client at the same time. </ListGroup.Item>
        <ListGroup.Item style={{ backgroundColor: '#fdffb6' }}>For Client Add and Edit forms: <b>Only unassociated clients appear in the Add Contact dropdown</b> and <b>only associated clients appear in the Delete Contact dropdown</b>.</ListGroup.Item>
        <ListGroup.Item style={{ backgroundColor: '#caffbf' }}>You can <b>associate or disassociate a client from a contact</b>. (Client can be disassociated by selecting “No Selection” option in the Associate a Client dropdown)</ListGroup.Item>
        <ListGroup.Item style={{ backgroundColor: '#ffc6ff' }}><b>Form input validations</b> and <b>success or error Alert messages on Form submissions</b> have been implemented in all the forms.</ListGroup.Item>
        <ListGroup.Item style={{ backgroundColor: '#a0c4ff' }}>Go <b>Mobile mode</b>! The site is fully responsive for mobile screen dimensions. </ListGroup.Item>
        <ListGroup.Item style={{ backgroundColor: '#bdb2ff' }}>There is a <u>bonus feature</u>: a <b>Search bar</b>. You can <b>search a client by name</b> or <b>search a contact by email address</b>.</ListGroup.Item>
      </ListGroup>

      <h5 className="mt-4 text-center">Unresolved UI bugs</h5>

      <ListGroup className="mb-4">
        <ListGroup.Item style={{ backgroundColor: '#ffadad' }}>In mobile screen dimensions, nav toggle doesn’t switch back to horizontal strips unless you click on a nav link or outside the nav bar.</ListGroup.Item>
        <ListGroup.Item style={{ backgroundColor: '#ffadad' }}>In mobile screen dimensions, the dropdown menu for Select State, City, and Associate a Client fields are too tiny.</ListGroup.Item>
      </ListGroup>
    </Container>
  );
}