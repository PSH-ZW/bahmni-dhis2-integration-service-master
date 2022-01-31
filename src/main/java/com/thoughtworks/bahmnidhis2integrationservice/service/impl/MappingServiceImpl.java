package com.thoughtworks.bahmnidhis2integrationservice.service.impl;

import com.thoughtworks.bahmnidhis2integrationservice.dao.impl.MappingDAOImpl;
import com.thoughtworks.bahmnidhis2integrationservice.exception.NoMappingFoundException;
import com.thoughtworks.bahmnidhis2integrationservice.model.Mapping;
import com.thoughtworks.bahmnidhis2integrationservice.service.MappingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class MappingServiceImpl implements MappingService {

    @Autowired
    private MappingDAOImpl mappingDAO;

    @Override
    public String saveMapping(String mappingName, String lookupTable, String mappingJson, String config, String currentMapping, String user) throws Exception {
        return mappingDAO.saveMapping(mappingName, lookupTable, mappingJson, config, currentMapping, user);
    }

    @Override
    public List<String> getMappingNames() {
        return mappingDAO.getMappingNames();
    }

    @Override
    public Map<String, Object> getMapping(String mappingName) throws NoMappingFoundException {
        return mappingDAO.getMapping(mappingName);
    }

    @Override
    public String saveMapping(List<Mapping> mappingsList) throws Exception {
        return mappingDAO.saveMapping(mappingsList);
    }

    @Override
    public List<Map<String, Object>> getAllMappings() throws NoMappingFoundException {
        return mappingDAO.getAllMappings();
    }
}
