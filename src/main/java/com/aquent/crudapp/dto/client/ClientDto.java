package com.aquent.crudapp.dto.client;

import com.aquent.crudapp.model.client.Client;

import java.util.ArrayList;
import java.util.List;

public class ClientDto {
    private Client client = null;
    private List<Integer> addContactList = new ArrayList<>();
    private List<Integer> deleteContactList = new ArrayList<>();

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public List<Integer> getAddContactList() {
        return addContactList;
    }

    public void setAddContactList(List<Integer> addContactList) {
        this.addContactList = addContactList;
    }

    public List<Integer> getDeleteContactList() {
        return deleteContactList;
    }

    public void setDeleteContactList(List<Integer> deleteContactList) {
        this.deleteContactList = deleteContactList;
    }
}
