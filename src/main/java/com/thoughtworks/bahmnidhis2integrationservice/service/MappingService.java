package com.thoughtworks.bahmnidhis2integrationservice.service;

import com.thoughtworks.bahmnidhis2integrationservice.exception.NoMappingFoundException;
import com.thoughtworks.bahmnidhis2integrationservice.model.Mapping;

import java.util.List;
import java.util.Map;

public interface MappingService {
    String saveMapping(String mappingName, String lookupTable, String mappingJson, String config, String currentMapping, String user) throws Exception;

    List<String> getMappingNames();

    Map<String, Object> getMapping(String mappingName) throws NoMappingFoundException;

    String saveMapping(List<Mapping> mappingsList) throws Exception;

    List<Map<String, Object>> getAllMappings() throws NoMappingFoundException;

    List<Map<String, String>> searchForDataElement(String searchString);
    List<Map<String, String>> searchTrackedEntityAttribute(String searchString);
    List<Map<String, String>> getProgramStages();
}
