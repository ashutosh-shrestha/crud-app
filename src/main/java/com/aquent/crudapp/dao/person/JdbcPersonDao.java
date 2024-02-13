package com.aquent.crudapp.dao.person;

import com.aquent.crudapp.model.person.Person;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collections;
import java.util.List;

/**
 * Spring JDBC implementation of {@link PersonDao}.
 */
@Component
public class JdbcPersonDao implements PersonDao {

    private static final String SQL_LIST_PEOPLE =
            "SELECT * FROM person " +
                    "ORDER BY first_name, last_name, person_id";

    private static final String SQL_READ_PERSON =
            "SELECT * FROM person " +
                    "WHERE person_id = :personId";

    private static final String SQL_DELETE_PERSON =
            "DELETE FROM person " +
                    "WHERE person_id = :personId";

    private static final String SQL_UPDATE_PERSON =
            "UPDATE person SET "
                    + "(first_name, last_name, client_id, email_address, street_address, city, state, zip_code)"
                    + " = (:firstName, :lastName, :clientId, :emailAddress, :streetAddress, :city, :state, :zipCode)"
                    + " WHERE person_id = :personId";

    private static final String SQL_CREATE_PERSON =
            "INSERT INTO person " +
                    "(client_id, first_name, last_name, email_address, street_address, city, state, zip_code)"
                    + " VALUES (:clientId, :firstName, :lastName, :emailAddress, :streetAddress, :city, :state, :zipCode)";

    private static final String SQL_LIST_ASSOCIATED_CONTACTS =
            "SELECT * FROM person " +
                    "WHERE client_id = :clientId";

    public static final String SQL_LIST_UNASSOCIATED_CONTACTS =
            "SELECT * FROM person " +
                    "WHERE client_id = -1";
    public static final String SQL_FIND_PERSON_BY_EMAIL =
            "SELECT * FROM person " +
                    "WHERE email_address LIKE :searchText";
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public JdbcPersonDao(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<Person> listPeople() {
        return namedParameterJdbcTemplate.getJdbcOperations().query(SQL_LIST_PEOPLE, new PersonRowMapper());
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS)
    public Integer createPerson(Person person) {
        try {
            KeyHolder keyHolder = new GeneratedKeyHolder();
            namedParameterJdbcTemplate.update(SQL_CREATE_PERSON, new BeanPropertySqlParameterSource(person), keyHolder);
            return keyHolder.getKey().intValue();
        } catch (DataIntegrityViolationException e) {
            throw new DataIntegrityViolationException("Entity already exists");
        }
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Person readPerson(Integer personId) {
        return namedParameterJdbcTemplate.queryForObject(SQL_READ_PERSON, Collections.singletonMap("personId", personId), new PersonRowMapper());
    }


    @Override
    @Transactional(propagation = Propagation.SUPPORTS)
    public void updatePerson(Person person) {
        try {
            namedParameterJdbcTemplate.update(SQL_UPDATE_PERSON, new BeanPropertySqlParameterSource(person));
        } catch (DataIntegrityViolationException e) {
            throw new DataIntegrityViolationException("Entity already exists");
        }
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS)
    public void deletePerson(Integer personId) {
        namedParameterJdbcTemplate.update(SQL_DELETE_PERSON, Collections.singletonMap("personId", personId));
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<Person> listAssociatedContacts(Integer clientId) {
        return namedParameterJdbcTemplate.query(SQL_LIST_ASSOCIATED_CONTACTS, Collections.singletonMap("clientId", clientId), new JdbcPersonDao.PersonRowMapper());
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<Person> listUnassociatedContacts() {
        return namedParameterJdbcTemplate.getJdbcOperations().query(SQL_LIST_UNASSOCIATED_CONTACTS, new PersonRowMapper());
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<Person> findByEmail(String searchText) {
        return namedParameterJdbcTemplate.query(SQL_FIND_PERSON_BY_EMAIL, Collections.singletonMap("searchText", "%"+searchText+"%"), new PersonRowMapper());
    }

    /**
     * Row mapper for person records.
     */
    private static final class PersonRowMapper implements RowMapper<Person> {

        @Override
        public Person mapRow(ResultSet rs, int rowNum) throws SQLException {
            Person person = new Person();
            person.setPersonId(rs.getInt("person_id"));
            person.setClientID(rs.getInt("client_id"));
            person.setFirstName(rs.getString("first_name"));
            person.setLastName(rs.getString("last_name"));
            person.setEmailAddress(rs.getString("email_address"));
            person.setStreetAddress(rs.getString("street_address"));
            person.setCity(rs.getString("city"));
            person.setState(rs.getString("state"));
            person.setZipCode(rs.getString("zip_code"));
            return person;
        }
    }
}
