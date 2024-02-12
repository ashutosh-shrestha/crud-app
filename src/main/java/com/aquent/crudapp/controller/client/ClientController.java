package com.aquent.crudapp.controller.client;

import com.aquent.crudapp.dto.client.ClientDto;
import com.aquent.crudapp.model.client.Client;
import com.aquent.crudapp.service.client.ClientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
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
     * Sends the client Name by ID.
     */
    @GetMapping(value = "getAssociatedClient")
    public Client getAssociatedClient(Integer clientId) {
        return clientService.getAssociatedClient(clientId);
    }

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
     * Sends all list of people.
     *
     * @return list of people
     */
    //for person edit form
//    @PatchMapping(value="add-contact")
//    public ResponseEntity<Boolean> addContactToClient(@RequestBody AddContactData addContactData) {
//        try {
//
//            return ResponseEntity.status(HttpStatus.OK).body(true);
//        }
//        catch(NoSuchElementException exp) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
//        }
//    }
//
//    /**
//     * Sends all list of people.
//     *
//     * @return list of people
//     */
//    @PatchMapping(value="delete-contact")
//    public ResponseEntity<Boolean> deleteContactFromClient(@RequestBody DeleteContactData deleteContactData) {
//        try {
//            clientService.deleteContactFromClient(deleteContactData);
//            return ResponseEntity.status(HttpStatus.OK).body(true);
//        }
//        catch(NoSuchElementException exp) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
//        }
//    }


    /**
     * Validates and saves an edited client.
     * On success, the client name is sent.
     * On failure, the validation errors are sent.
     *
     * @param client - a populated bean for client
     * @return client name as single-element list to check in frontend.
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
     *
     * @param clientId - ID of the client to be deleted
     * @return true if success, else false
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

    @GetMapping("/search")
    public List<Client> searchByName(@RequestParam String searchText) {
        return clientService.findByName(searchText);
    }
}

