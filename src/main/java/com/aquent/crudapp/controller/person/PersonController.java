package com.aquent.crudapp.controller.person;

import com.aquent.crudapp.model.person.Person;
import com.aquent.crudapp.service.person.PersonService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * Controller for handling basic person management operations.
 */
@RestController
@ResponseBody
@RequestMapping("person")
@CrossOrigin
public class PersonController {

    private final PersonService personService;

    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    /**
     * Sends all list of people.
     *
     * @return list of people
     */
    @GetMapping(value = "list")
    public List<Person> list() {
        return personService.listPerson();
    }


    /**
     * Validates and saves a new person.
     * On success, the person name is sent.
     * On failure, the error code sent.
     *
     * @param person populated form bean for the person
     * @return ResponseEntity with HttpStatus and body
     */
    @PostMapping(value = "create")
    public ResponseEntity<List<String>> create(@RequestBody Person person) {
        List<String> errors = personService.validatePerson(person);
            if (errors.isEmpty()) {
                personService.createPerson(person);
                List<String> successList = new ArrayList<>();
                successList.add(person.getPersonName());
                return ResponseEntity.status(HttpStatus.OK).body(successList);
            }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errors);
        }

    /**
     * Validates and saves an edited person.
     * On success, the person name is sent
     * On failure, the error code is sent
     *
     * @param person populated form bean for the person
     * @return ResponseEntity with HttpStatus and body
     */
    @PutMapping(value = "edit")
    public ResponseEntity<List<String>> edit(@RequestBody Person person) {
        List<String> errors = personService.validatePerson(person);

        if (errors.isEmpty()) {
            personService.updatePerson(person);
            List<String> successList = new ArrayList<>();
            successList.add(person.getPersonName());
            return ResponseEntity.status(HttpStatus.OK).body(successList);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errors);
    }

    /**
     * Handles person deletion
     * On success, true and success code is sent
     * On failure, false and error code is sent
     *
     * @param personId the ID of the person to be deleted
     * @return ResponseEntity with HttpStatus and body
     */
    @DeleteMapping(value = "delete")
    public ResponseEntity<Boolean> delete(@RequestParam Integer personId) {
        try {
            personService.deletePerson(personId);
            return ResponseEntity.status(HttpStatus.OK).body(true);
        }
        catch(NoSuchElementException exp) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }

    /**
     * Sends all list of people for a client.
     *
     * @param clientId of the client associated with the contacts to retrieve
     * @return list of people object
     */
    @GetMapping(value = "listAssociatedContacts")
    public List<Person> listAssociatedContacts(@RequestParam Integer clientId) { return personService.listAssociatedContacts(clientId);}

    /**
     * Sends all list of people who have not been assigned a client.
     *
     * @return list of people object
     */
    @GetMapping(value = "listUnassociatedContacts")
    public List<Person> listUnassociatedContacts() { return personService.listUnassociatedContacts();}


    /**
     * Sends a list of persons whose email address match the given search string.
     *
     * @param searchText the string to lookup
     * @return list of Person objects
     */
    @GetMapping("/search")
    public List<Person> searchByEmail(@RequestParam String searchText) {
        return personService.findByEmail(searchText);
    }
}