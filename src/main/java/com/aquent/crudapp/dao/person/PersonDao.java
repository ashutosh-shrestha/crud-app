package com.aquent.crudapp.dao.person;

import com.aquent.crudapp.model.person.Person;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Operations on the "person" table.
 */
@Repository
public interface PersonDao {

    /**
     * Retrieves all person records.
     *
     * @return list of person records
     */
    List<Person> listPeople();

    /**
     * Creates a new person record.
     *
     * @param person the values to save
     * @return the id of new person
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
     * @param person object with the new values to save
     */
    void updatePerson(Person person);

    /**
     * Deletes a person record by ID.
     *
     * @param id of the person
     */
    void deletePerson(Integer id);


    /**
     * lists all associated persons given a client
     *
     * @param - List of Person objects
     */
    List<Person> listAssociatedContacts(Integer clientId);

    /**
     * list all persons who are unassociated with in any company
     *
     * @param - List of Person objects
     */
    List<Person> listUnassociatedContacts();

    /**
     * Sends a list of persons whose email address match the given search string.
     *
     * @param searchText the string to lookup
     * @return list of Person objects
     */
    List<Person> findByEmail(String searchText);

}