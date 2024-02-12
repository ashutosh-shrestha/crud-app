import axios from 'axios';

const baseURL = "http://localhost:8081/"

// Contact serivce API URLs
const GET_CLIENT_LIST = baseURL + 'client/list';
const ADD_CLIENT = baseURL + 'client/create';
const EDIT_CLIENT = baseURL + 'client/edit';
const DELETE_CLIENT = baseURL + 'client/delete';
const GET_ASSOCIATED_CLIENT_NAME = baseURL + 'client/getAssociatedClient';
const GET_CLIENT_LIST_BY_NAME = baseURL + 'client/search';

class ClientService {

    getClientList(){
        return axios.get(GET_CLIENT_LIST);
    }

    addClient(clientData, addContactList){
        return axios.post(ADD_CLIENT,{
            client: {
                name: clientData.name,
                phone: clientData.phone,
                companyURI: clientData.website,
                streetAddress: clientData.streetAddress,
                city: clientData.city,
                state: clientData.state,
                zipCode: clientData.zip
            },
            addContactList: addContactList
        });
    }

    editClient(clientData, editAddContactList, editDeleteContactList){
        return axios.put(EDIT_CLIENT, {
            client: {
                clientId: clientData.clientId,
                name: clientData.name,
                phone: clientData.phone,
                companyURI: clientData.companyURI,
                streetAddress: clientData.streetAddress,
                city: clientData.city,
                state: clientData.state,
                zipCode: clientData.zipCode
            },
            addContactList: editAddContactList,
            deleteContactList: editDeleteContactList
        });
    }

    deleteClient(clientId){
        return axios.delete(DELETE_CLIENT + "?clientId=" + clientId);
    }

    getAssociatedClient(clientId){
        return axios.get(GET_ASSOCIATED_CLIENT_NAME + "?clientId=" + clientId);
    }

    getClientListByName(searchText){
        return axios.get(GET_CLIENT_LIST_BY_NAME + "?searchText=" + searchText);
    }

}

export default new ClientService();