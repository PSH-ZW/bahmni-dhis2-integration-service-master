package com.thoughtworks.bahmnidhis2integrationservice.exception;

public class NoMappingFoundException extends Exception {
    public NoMappingFoundException(String mappingName) {
        super("Mapping " + mappingName + " not found.");
    }
}
