package com.thoughtworks.bahmnidhis2integrationservice.dao;

import com.thoughtworks.bahmnidhis2integrationservice.exception.NoMappingFoundException;
import com.thoughtworks.bahmnidhis2integrationservice.model.Mapping;

import java.util.List;
import java.util.Map;

public interface MappingDAO {
    String saveMapping(String mappingName, String mappingJson, String config, String currentMapping, String user) throws Exception;
    List<String> getMappingNames();

    Map<String, Object> getMapping(String mappingName) throws NoMappingFoundException;

    String saveMapping(List<Mapping> mappingsList) throws Exception;

    List<Map<String, Object>> getAllMappings() throws NoMappingFoundException;
}
