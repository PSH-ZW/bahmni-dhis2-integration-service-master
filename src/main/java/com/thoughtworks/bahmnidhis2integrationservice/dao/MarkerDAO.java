package com.thoughtworks.bahmnidhis2integrationservice.dao;

import com.thoughtworks.bahmnidhis2integrationservice.model.Mapping;

import java.util.List;

public interface MarkerDAO {
    void createMarkerEntries(String oldMappingName, String newMappingName);

    void createMarkerEntries(List<Mapping> mappingList);
}
