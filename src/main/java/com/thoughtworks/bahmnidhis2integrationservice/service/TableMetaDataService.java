package com.thoughtworks.bahmnidhis2integrationservice.service;

import java.util.List;

public interface TableMetaDataService {

    List<String> getAllTableNames();

    List<String> getAllColumns(String tableName);
}
