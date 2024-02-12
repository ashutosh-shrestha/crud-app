import axios from 'axios';

const baseURL = "http://localhost:8081/"

// Contact serivce API URLs
const GET_CONTACT_LIST = baseURL + 'person/list';
const ADD_CONTACT = baseURL + 'person/create';
const EDIT_CONTACT = baseURL + 'person/edit';
const DELETE_CONTACT = baseURL + 'person/delete';
const GET_ASSOCIATED_CONTACT = baseURL + 'person/listAssociatedContacts';
const GET_UNASSOCIATED_CONTACT_LIST = baseURL + 'person/listUnassociatedContacts';

class ContactSerivce {

    getContactList(){
        return axios.get(GET_CONTACT_LIST);
    }

    addContact(data){
        return axios.post(ADD_CONTACT,{
            firstName: data.firstName,
            lastName: data.lastName,
            clientId: data.clientId,
            emailAddress: data.email,
            streetAddress: data.streetAddress,
            city: data.city,
            state: data.state,
            zipCode: data.zip
        });
    }

    editContact(data){
        return axios.put(EDIT_CONTACT, {
            personId: data.personId,
            firstName: data.firstName,
            lastName: data.lastName,
            clientId: data.clientId,
            emailAddress: data.emailAddress,
            streetAddress: data.streetAddress,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode
        });
    }

    deleteContact(contactId){
        return axios.delete(DELETE_CONTACT + "?personId=" + contactId);
    }

    getAssociatedContacts(clientId){
        return axios.get(GET_ASSOCIATED_CONTACT + "?clientId=" + clientId);
    }

    getUnassociatedContacts(){
        return axios.get(GET_UNASSOCIATED_CONTACT_LIST);
    }
}

export default new ContactSerivce();