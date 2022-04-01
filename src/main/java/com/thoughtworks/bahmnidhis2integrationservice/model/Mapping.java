package com.thoughtworks.bahmnidhis2integrationservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Mapping {
    private String program_name;
    private String current_mapping;
    private String mapping_json;
    private String config;
    private String user;
}
