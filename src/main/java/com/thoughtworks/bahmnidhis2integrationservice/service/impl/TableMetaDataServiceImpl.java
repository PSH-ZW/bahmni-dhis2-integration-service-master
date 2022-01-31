package com.thoughtworks.bahmnidhis2integrationservice.service.impl;

import com.thoughtworks.bahmnidhis2integrationservice.dao.impl.TableMetaDataDAOImpl;
import com.thoughtworks.bahmnidhis2integrationservice.service.TableMetaDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TableMetaDataServiceImpl implements TableMetaDataService {

    @Autowired
    private TableMetaDataDAOImpl tableMetaDataDAO;

    @Override
    public List<String> getAllTableNames() {
        return tableMetaDataDAO.getAllTableNames();
    }

    @Override
    public List<String> getAllColumns(String tableName) {
        return tableMetaDataDAO.getAllColumns(tableName);
    }
}
