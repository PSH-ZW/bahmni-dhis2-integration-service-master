package com.thoughtworks.bahmnidhis2integrationservice.model;

import lombok.Data;

@Data
public class ServerErrorResponse {
    private int status;
    private String error;
    private String message;
}
