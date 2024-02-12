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
     * Retrieves all of the person records.
     *
     * @return list of person records
     */
    List<Person> listPeople();

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
     * lists all associated persons given a clientid
     *
     * @param - list of persons
     */
    List<Person> listAssociatedContacts(Integer clientId);

    /**
     * list all persons who are unassociated with in any company
     *
     * @param - list of persons
     */
    List<Person> listUnassociatedContacts();

    /**
     * associates a client to a person
     *
     * @param - id of the client and person to be associated
     */
    int addClientToPerson(Integer personId, Integer clientId);

    /**
     * deletes a client association from a person
     *
     * @param - id of the person to be disassociated from their respective client
     */
    int deleteAssociatedClient(Integer personId);
}
