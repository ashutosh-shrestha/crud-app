package com.aquent.crudapp.service.client;

import com.aquent.crudapp.model.client.Client;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Client Operations
 */
@Service
public interface ClientService {

    /**
     * Retrieves all client records.
     *
     * @return List of Client objects
     */
    List<Client> listClient();

    /**
     * Creates a new client record
     *
     * @param client the values to save
     * @return the new client ID
     */
    Integer createClient(Client client);

    /**
     * Reads existing client record
     *
     * @param clientId of the client
     * @return Client object
     */
    Client readClient(Integer clientId);

    /**
     * Updates an existing client record
     *
     * @param client object with the new values to save
     */
    void updateClient(Client client);

    /**
     * Deletes a client record by ID
     *
     * @param clientId of the client
     */
    void deleteClient(Integer clientId);


    /**
     * Validates client populated data
     *
     * @param client the values to validate
     * @return list of error messages
     */
    List<String> validateClient(Client client);

    void addContactToClient(List<Integer> addContactData, Integer clientId);

    void deleteContactFromClient(List<Integer> deleteContactData);

    /**
     * Retrieves client details by client id.
     *
     * @return Client object
     */
    Client getAssociatedClient(Integer clientId);

    /**
     * Sends a list of clients whose name match the given search string.
     *
     * @return List of Client objects
     */
    List<Client> findByName(String searchText);

}