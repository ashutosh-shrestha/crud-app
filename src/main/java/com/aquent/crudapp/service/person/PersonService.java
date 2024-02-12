package com.aquent.crudapp.service.person;

import com.aquent.crudapp.model.person.Person;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Person operations.
 */
@Service
public interface PersonService {

    /**
     * Retrieves all of the person records.
     *
     * @return list of person records
     */
    List<Person> listPerson();


    /**
     * Creates a new person record.
     *
     * @param person the values to save
     * @return the new person ID
     */
    Integer createPerson(Person person);

    /**
     * Retrieves a person record by ID.
     *
     * @param id the person ID
     * @return the person record
     */
    Person readPerson(Integer id);

    /**
     * Updates an existing person record.
     *
     * @param person the new values to save
     */
    void updatePerson(Person person);

    /**
     * Deletes a person record by ID.
     *
     * @param id the person ID
     */
    void deletePerson(Integer id);

    /**
     * Validates populated person data.
     *
     * @param person the values to validate
     * @return list of error messages
     */
    List<String> validatePerson(Person person);


    List<Person> listAssociatedContacts(Integer clientId);

    List<Person> listUnassociatedContacts();

    int addClientToPerson(Integer personId, Integer clientId);

    int deleteAssociatedClient(Integer personId);

    List<Person> findByEmail(String searchText);
}
