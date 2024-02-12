package com.aquent.crudapp.controller.client;

import com.aquent.crudapp.dto.client.ClientDto;
import com.aquent.crudapp.model.client.Client;
import com.aquent.crudapp.service.client.ClientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * Controller for handling basic client management operations
 */
@RestController
@ResponseBody
@RequestMapping("client")
@CrossOrigin(origins = "http://localhost:3000")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    /**
     * Sends all lists of clients
     *
     * @return list of clients
     */
    @GetMapping(value = "list")
    public List<Client> list() {
        return clientService.listClient();
    }

    /**
     * Validates and saves a new client.
     * On success, the client name is sent.
     * On failure, the error code is sent.
     *
     * @param clientDto - a populated bean for client data transfer object
     * @return ResponseEntity with HttpStatus and body
     */
    @PostMapping(value= "create")
    public ResponseEntity<List<String>> create(@RequestBody ClientDto clientDto) {
        Client client = clientDto.getClient();
        List<String> errors = clientService.validateClient(client);
        if(errors.isEmpty()) {
            Integer clientId = clientService.createClient(client);
            List<Integer> addContactData = clientDto.getAddContactList();

            if(!addContactData.isEmpty()){
                clientService.addContactToClient(addContactData, clientId);
            }

            List<String> successList = new ArrayList<>();
            successList.add(client.getName());
            return ResponseEntity.status(HttpStatus.OK).body(successList);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errors);
    }

    /**
     * Validates and saves an edited client.
     * On success, the client name is sent.
     * On failure, the error code sent.
     *
     * @param clientDto - a populated bean for client data transfer object
     * @return ResponseEntity with HttpStatus and body
     */
    @PutMapping(value = "edit")
    public ResponseEntity<List<String>> edit(@RequestBody ClientDto clientDto) {
        Client client = clientDto.getClient();
        List<String> errors = clientService.validateClient(client);
        if(errors.isEmpty()) {
            clientService.updateClient(client);
            List<Integer> addContactData = clientDto.getAddContactList();
            List<Integer> deleteContactData = clientDto.getDeleteContactList();

            if(!addContactData.isEmpty()){
                clientService.addContactToClient(addContactData, client.getClientId());
            }

            if(!deleteContactData.isEmpty()){
                clientService.deleteContactFromClient(deleteContactData);
            }

            List<String> successList = new ArrayList<>();
            successList.add(client.getName());
            return ResponseEntity.status(HttpStatus.OK).body(successList);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errors);
    }

    /**
     * Handles client deletion
     * On success, true and success code is sent
     * On failure, false and error code is sent
     *
     * @param clientId - ID of the client to be deleted
     * @return ResponseEntity with HttpStatus and body
     */
    @DeleteMapping(value = "delete")
    public ResponseEntity<Boolean> delete(@RequestParam Integer clientId) {
        try {
            clientService.deleteClient(clientId);
            return ResponseEntity.status(HttpStatus.OK).body(true);
        }
        catch(NoSuchElementException exp) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }


    /**
     * Sends the client detail by clientID.
     *
     * @param clientId - ID of the client
     * @return Client object that holds requested client data
     */
    @GetMapping(value = "getAssociatedClient")
    public Client getAssociatedClient(Integer clientId) {
        return clientService.getAssociatedClient(clientId);
    }

    /**
     * Sends a list of clients whose name match the given search string.
     *
     * @return List of Client objects
     */
    @GetMapping("/search")
    public List<Client> searchByName(@RequestParam String searchText) {
        return clientService.findByName(searchText);
    }
}

