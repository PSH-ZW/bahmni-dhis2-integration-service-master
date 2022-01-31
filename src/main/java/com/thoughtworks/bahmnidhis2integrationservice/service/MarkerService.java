package com.thoughtworks.bahmnidhis2integrationservice.service;

import com.thoughtworks.bahmnidhis2integrationservice.model.Mapping;

import java.util.List;

public interface MarkerService {
    void createEntriesForNewService(String oldMappingName, String newMappingName);

    void createMarkerEntries(List<Mapping> mappingList);
}
