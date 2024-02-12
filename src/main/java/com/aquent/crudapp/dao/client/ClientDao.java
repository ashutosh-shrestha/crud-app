package com.aquent.crudapp.dao.client;

import com.aquent.crudapp.model.client.Client;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Operations on the "client" table
 */
@Repository
public interface ClientDao {

    /**
     * Retrieves all clients record.
     *
     * @return list of client record
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
     * Retrieves a client record by ID.
     *
     * @param clientId of the client
     * @return Client object
     */
    Client readClient(Integer clientId);

    /**
     * Updates an existing client record.
     *
     * @param client object with new values to save
     */
    void updateClient(Client client);

    /**
     * Deletes a client record by ID
     *
     * @param clientId the client ID
     */
    void deleteClient(Integer clientId);

    /**
     * adds contact to a client
     *
     * @param - clientId of the client and person to be associated
     */
    void addContactToClient(Integer contactId, Integer clientId);

    /**
     * deletes a contact association from a client
     *
     * @param - contactId: ID of the person to be deleted from their respective client
     */
    void deleteContactFromClient(Integer contactId);

    /**
     * Retrieves client details of a client associated to a person
     * @param personId of the person
     * @retyrb Client object
     */
    Client getAssociatedClient(Integer personId);

    /**
     * Sends a list of clients whose name match the given search string
     *
     * @param searchText is the string to lookup
     * @return List of Client objects
     */
    List<Client> findByName(String searchText);

}