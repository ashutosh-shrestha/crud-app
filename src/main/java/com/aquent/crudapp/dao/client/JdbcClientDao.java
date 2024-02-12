package com.aquent.crudapp.dao.client;

import com.aquent.crudapp.model.client.Client;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Spring JDBC implementation of {@link ClientDao}
 */
@Component
public class JdbcClientDao implements ClientDao{

    private static final String SQL_LIST_CLIENTS =
            "SELECT * FROM client " +
                    "ORDER BY client_name";

    private static final String SQl_READ_CLIENT =
            "SELECT * FROM client " +
                    "WHERE client_id = :clientId";

    private static final String SQL_UPDATE_CLIENT =
            "UPDATE client SET "
                    + "(client_name, client_phone, client_uri, street_address, city, state, zip_code)"
                    + " = (:name, :phone, :companyURI, :streetAddress, :city, :state, :zipCode)"
                    + "WHERE client_id = :clientId";

    private static final String SQL_CREATE_CLIENT =
            "INSERT INTO client " +
                    "(client_name, client_phone, client_uri, street_address, city, state, zip_code) " +
                    "VALUES (:name, :phone, :companyURI, :streetAddress, :city, :state, :zipCode)";

    private static final String SQL_DELETE_CLIENT =
            "DELETE FROM client " +
                    "WHERE client_id = :clientId";

    private static final String SQL_UPDATE_PERSON_ON_DELETE =
            "UPDATE person SET client_id = -1 " +
                    "WHERE client_id = :clientId";

    private static final String SQL_ADD_CONTACT_TO_CLIENT =
            "UPDATE person SET client_id = :clientId " +
                    "WHERE person_id = :contactId";

    private static final String SQL_DELETE_CONTACT_FROM_CLIENT =
            "UPDATE person SET client_id = -1 " +
                    "WHERE person_id = :contactId";

    private static final String SQL_GET_CLIENT_NAME =
            "SELECT * FROM client " +
                    "WHERE client_id = :clientId";

    private static final String SQL_FIND_CLIENT_BY_NAME =
            "SELECT * FROM client " +
                    "WHERE UPPER(client_name) LIKE UPPER(:searchText)";
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public JdbcClientDao(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<Client> listClient() {
        return namedParameterJdbcTemplate.getJdbcOperations().query(SQL_LIST_CLIENTS, new ClientRowMapper());
    }


    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Client getAssociatedClient(Integer clientId) {
        return namedParameterJdbcTemplate.queryForObject(SQL_GET_CLIENT_NAME, Collections.singletonMap("clientId", clientId), new ClientRowMapper());
    }
    @Override
    @Transactional(propagation = Propagation.SUPPORTS)
    public Integer createClient(Client client) {
        int newId = -1;
        KeyHolder keyHolder = new GeneratedKeyHolder();
        namedParameterJdbcTemplate.update(SQL_CREATE_CLIENT, new BeanPropertySqlParameterSource(client), keyHolder);
        if (keyHolder.getKeys().size() > 1) {
            newId = (Integer)keyHolder.getKeys().get("client_id");
        }
        return newId;
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Client readClient(Integer clientId) {
        return namedParameterJdbcTemplate.queryForObject(SQl_READ_CLIENT, Collections.singletonMap("clientId", clientId), new ClientRowMapper());
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS)
    public void updateClient(Client client) {
        namedParameterJdbcTemplate.update(SQL_UPDATE_CLIENT, new BeanPropertySqlParameterSource(client));
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS)
    public void deleteClient(Integer clientId) {
        //Possible to make a join statement? See later
        namedParameterJdbcTemplate.update(SQL_UPDATE_PERSON_ON_DELETE, Collections.singletonMap("clientId", clientId));
        namedParameterJdbcTemplate.update(SQL_DELETE_CLIENT, Collections.singletonMap("clientId", clientId));
    }


    @Override
    @Transactional(propagation = Propagation.SUPPORTS)
    public int addContactToClient(Integer contactId, Integer clientId) {
        Map mapper = new HashMap();
        mapper.put("contactId", contactId);
        mapper.put("clientId", clientId);
        return namedParameterJdbcTemplate.update(SQL_ADD_CONTACT_TO_CLIENT, mapper);
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS)
    public int deleteContactFromClient(Integer contactId) {
        return namedParameterJdbcTemplate.update(SQL_DELETE_CONTACT_FROM_CLIENT, Collections.singletonMap("contactId", contactId));
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<Client> findByName(String searchText) {
        return namedParameterJdbcTemplate.query(SQL_FIND_CLIENT_BY_NAME, Collections.singletonMap("searchText", "%"+searchText+"%"), new ClientRowMapper());
    }



    /**
     * Row wrapper for client records
     */
    private static final class ClientRowMapper implements RowMapper<Client> {

        @Override
        public Client mapRow(ResultSet resultSet, int i) throws SQLException {
            Client client = new Client();
            client.setClientId(resultSet.getInt("client_id"));
            client.setName(resultSet.getString("client_name"));
            client.setCompanyURI(resultSet.getString("client_uri"));
            client.setPhone(resultSet.getString("client_phone"));
            client.setStreetAddress(resultSet.getString("street_address"));
            client.setCity(resultSet.getString("city"));
            client.setState(resultSet.getString("state"));
            client.setZipCode(resultSet.getString("zip_code"));
            return client;
        }
    }
}