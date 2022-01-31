package com.thoughtworks.bahmnidhis2integrationservice.security.response;

import lombok.Data;

import java.util.List;

@Data
public class User {
    private String uuid;
    private String display;
    private String username;
    private String systemId;
    private Person person;
    private List<Privilege> privileges;
}
