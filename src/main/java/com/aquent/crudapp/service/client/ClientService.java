package com.aquent.crudapp.service.client;

import com.aquent.crudapp.dto.AddContactData;
import com.aquent.crudapp.dto.DeleteContactData;
import com.aquent.crudapp.model.client.Client;
import com.aquent.crudapp.model.person.Person;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Client Operations
 */
@Service
public interface ClientService {

    /**
     * Retrieves all of the client records.
     *
     * @return list of client records
     */
    List<Client> listClient();

    /**
     * Retrieves client name by person id.
     */
    Client getAssociatedClient(Integer clientId);

    /**
     * Creates a new client record
     *
     * @param client the values to save
     * @return the new client ID
     */
    Integer createClient(Client client);

    /**
     * Updates an existing client record
     *
     * @param clientId the client ID
     * @return the client ID
     */
    Client readClient(Integer clientId);

    /**
     * Updates an existing client record
     *
     * @param client the new values to save
     */
    void updateClient(Client client);

    /**
     * Deletes a client record by ID
     *
     * @param clientId the client ID
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
}