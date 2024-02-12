package com.aquent.crudapp.service.person;

import com.aquent.crudapp.dao.person.PersonDao;
import com.aquent.crudapp.model.person.Person;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

/**
 * Default implementation of {@link PersonService}.
 */
@Component
public class DefaultPersonService implements PersonService {

    private final PersonDao personDao;
    private final Validator validator;

    public DefaultPersonService(PersonDao personDao, Validator validator) {
        this.personDao = personDao;
        this.validator = validator;
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<Person> listPerson() {
        return personDao.listPeople();
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Person readPerson(Integer id) {
        return personDao.readPerson(id);
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS)
    public Integer createPerson(Person person) {
        return personDao.createPerson(person);
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS)
    public void updatePerson(Person person) {
        personDao.updatePerson(person);
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS)
    public void deletePerson(Integer id) {
        personDao.deletePerson(id);
    }

    @Override
    public List<String> validatePerson(Person person) {
        Set<ConstraintViolation<Person>> violations = validator.validate(person);
        List<String> errors = new ArrayList<String>(violations.size());
        for (ConstraintViolation<Person> violation : violations) {
            errors.add(violation.getMessage());
        }
        Collections.sort(errors);
        return errors;
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<Person> listAssociatedContacts(Integer clientId) {
        return personDao.listAssociatedContacts(clientId);
    }
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<Person> listUnassociatedContacts() {
        return personDao.listUnassociatedContacts();
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS)
    public int addClientToPerson(Integer personId, Integer clientId) {
        return personDao.addClientToPerson(personId, clientId);
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = false)
    public int deleteAssociatedClient(Integer personId) {
        return personDao.deleteAssociatedClient(personId);
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<Person> findByEmail(String searchText) {
        return personDao.findByEmail(searchText);
    }
}
