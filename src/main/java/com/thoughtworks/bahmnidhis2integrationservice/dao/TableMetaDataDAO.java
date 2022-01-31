package com.thoughtworks.bahmnidhis2integrationservice.dao;

import java.util.List;

public interface TableMetaDataDAO {

    List<String> getAllTableNames();

    List<String> getAllColumns(String tableName);
}
