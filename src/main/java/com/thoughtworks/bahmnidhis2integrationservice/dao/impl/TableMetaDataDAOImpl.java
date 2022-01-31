package com.thoughtworks.bahmnidhis2integrationservice.dao.impl;

import com.thoughtworks.bahmnidhis2integrationservice.dao.TableMetaDataDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TableMetaDataDAOImpl implements TableMetaDataDAO {

    @Autowired
    @Qualifier("jdbcTemplate")
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<String> getAllTableNames() {
        String sql = "SELECT table_name FROM INFORMATION_SCHEMA.TABLES where TABLE_SCHEMA='public'";
        return jdbcTemplate.queryForList(sql).stream().map(table -> table.get("table_name").toString())
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getAllColumns(String tableName){
        String sql = String.format("SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='public' AND TABLE_NAME='%s'",tableName);
        return jdbcTemplate.queryForList(sql).stream().map(table -> table.get("column_name").toString())
                .collect(Collectors.toList());
    }
}
