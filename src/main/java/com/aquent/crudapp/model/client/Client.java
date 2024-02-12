package com.aquent.crudapp.model.client;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * The person entity corresponding to the "client" table in the database.
 */

public class Client {
    private Integer clientId;

    @NotNull
    @Size(min = 1, max = 100, message = "Company name is required with maximum length of 100")
    private String companyName;

    @NotNull
    @Size(min = 8, max = 100, message = "Company URI is required with maximum length of 50 and minimum length of 8.")
    private String companyURI;

    @NotNull
    @Size(min = 10, max = 15, message = "Company phone is required with maximum length of 15 and minimum length of 10.")
    private String phoneNumber;

    @NotNull
    @Size(min = 1, max = 100, message = "Street address is required with maximum length of 50")
    private String streetAddress;

    @NotNull
    @Size(min = 1, max = 50, message = "City is required with maximum length of 50")
    private String city;

    @NotNull
    @Size(min = 2, max = 2, message = "State is required with length 2")
    private String state;

    @NotNull
    @Size(min = 5, max = 5, message = "Zip code is required with length 5")
    private String zipCode;

    public Integer getClientId() {
        return this.clientId;
    }

    public void setClientId(Integer clientId) {
        this.clientId = clientId;
    }

    public String getName() {
        return this.companyName;
    }

    public void setName(String name) {
        this.companyName = name;
    }

    public String getCompanyURI() {
        return this.companyURI;
    }

    public void setCompanyURI(String companyURI) {
        this.companyURI = companyURI;
    }

    public String getPhone() {
        return this.phoneNumber;
    }

    public void setPhone(String phone) {
        this.phoneNumber = phone;
    }

    public String getStreetAddress() {
        return this.streetAddress;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public String getCity() {
        return this.city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return this.state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getZipCode() {
        return this.zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    @Override
    public String toString() {
        return this.companyName;
    }
}