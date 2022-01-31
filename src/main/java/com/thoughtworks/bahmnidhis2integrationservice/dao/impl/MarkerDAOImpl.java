package com.thoughtworks.bahmnidhis2integrationservice.dao.impl;

import com.thoughtworks.bahmnidhis2integrationservice.dao.MarkerDAO;
import com.thoughtworks.bahmnidhis2integrationservice.model.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;

@Component
public class MarkerDAOImpl implements MarkerDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void createMarkerEntries(String oldMappingName, String newMappingName) {

        if ("".equals(oldMappingName)) {

            createEntries(newMappingName);

        } else {

            updateEntries(oldMappingName, newMappingName);

        }
    }

    @Override
    public void createMarkerEntries(List<Mapping> mappingList) {
        StringBuilder sql = new StringBuilder();
        mappingList.forEach(mapping -> {
            if (StringUtils.isEmpty(mapping.getCurrent_mapping())) {

                sql.append(createEntriesSql(mapping.getMapping_name()));
            } else {

                updateExistingUpdateEntries(mapping.getMapping_name());
            }
        });
        jdbcTemplate.update(sql.toString());
    }

    private boolean isEntriesNotExists(String programName) {

        String checkForExistence = String.format("SELECT count(*) FROM marker WHERE program_name = '%s'", programName);
        Map<String, Object> existingEntriesCount = jdbcTemplate.queryForMap(checkForExistence);

        return Integer.parseInt(existingEntriesCount.get("count").toString()) == 0;
    }

    private void createEntries(String mappingName) {

        StringBuilder sql = new StringBuilder();
        sql.append("INSERT INTO marker (program_name, category, last_synced_date) VALUES ");
        sql.append(String.format("('%s', 'instance', null),", mappingName));
        sql.append(String.format("('%s', 'new_active_enrollment', null),", mappingName));
        sql.append(String.format("('%s', 'new_completed_enrollment', null),", mappingName));
        sql.append(String.format("('%s', 'new_cancelled_enrollment', null),", mappingName));
        sql.append(String.format("('%s', 'updated_active_enrollment', null),", mappingName));
        sql.append(String.format("('%s', 'updated_completed_enrollment', null),", mappingName));
        sql.append(String.format("('%s', 'updated_cancelled_enrollment', null),", mappingName));
        sql.append(String.format("('%s', 'event', null)", mappingName));

        jdbcTemplate.update(sql.toString());

    }

    private void updateEntries(String oldMappingName, String newMappingName) {
        if (isEntriesNotExists(newMappingName)) {

            String sql = String.format("UPDATE marker SET program_name='%s' WHERE program_name='%s'"
                    , newMappingName, oldMappingName);

            jdbcTemplate.update(sql.toString());

            updateExistingUpdateEntries(newMappingName);

        } else {

            updateExistingUpdateEntries(newMappingName);

        }
    }

    private void updateExistingUpdateEntries(String newMappingName) {

        String deleteSql = String.format("delete from marker where program_name = '%s' and category = 'enrollment'", newMappingName);
        jdbcTemplate.update(deleteSql.toString());
        String insertSql1 = String.format("INSERT INTO marker (program_name, category, last_synced_date)\n" +
                "SELECT '%s' AS program_name, 'new_active_enrollment' AS category, null as last_synced_date FROM marker\n" +
                "WHERE NOT EXISTS(SELECT category FROM marker WHERE program_name = '%s' and category = 'new_active_enrollment')LIMIT 1", newMappingName, newMappingName);
        jdbcTemplate.update(insertSql1.toString());

        String insertSql2 = String.format("INSERT INTO marker (program_name, category, last_synced_date)\n" +
                "SELECT '%s' AS program_name, 'new_completed_enrollment' AS category, null as last_synced_date FROM marker\n" +
                "WHERE NOT EXISTS(SELECT category FROM marker WHERE program_name = '%s' and category = 'new_completed_enrollment')LIMIT 1", newMappingName, newMappingName);
        jdbcTemplate.update(insertSql2.toString());

        String insertSql5 = String.format("INSERT INTO marker (program_name, category, last_synced_date)\n" +
                "SELECT '%s' AS program_name, 'new_cancelled_enrollment' AS category, null as last_synced_date FROM marker\n" +
                "WHERE NOT EXISTS(SELECT category FROM marker WHERE program_name = '%s' and category = 'new_cancelled_enrollment')LIMIT 1", newMappingName, newMappingName);
        jdbcTemplate.update(insertSql5.toString());

        String insertSql3 = String.format("INSERT INTO marker (program_name, category, last_synced_date)\n" +
                "SELECT '%s' AS program_name, 'updated_active_enrollment' AS category, null as last_synced_date FROM marker\n" +
                "WHERE NOT EXISTS(SELECT category FROM marker WHERE program_name = '%s' and category = 'updated_active_enrollment')LIMIT 1", newMappingName, newMappingName);
        jdbcTemplate.update(insertSql3.toString());

        String insertSql4 = String.format("INSERT INTO marker (program_name, category, last_synced_date)\n" +
                "SELECT '%s' AS program_name, 'updated_completed_enrollment' AS category, null as last_synced_date FROM marker\n" +
                "WHERE NOT EXISTS(SELECT category FROM marker WHERE program_name = '%s' and category = 'updated_completed_enrollment')LIMIT 1", newMappingName, newMappingName);
        jdbcTemplate.update(insertSql4.toString());

        String insertSql7 = String.format("INSERT INTO marker (program_name, category, last_synced_date)\n" +
                "SELECT '%s' AS program_name, 'updated_cancelled_enrollment' AS category, null as last_synced_date FROM marker\n" +
                "WHERE NOT EXISTS(SELECT category FROM marker WHERE program_name = '%s' and category = 'updated_cancelled_enrollment')LIMIT 1", newMappingName, newMappingName);
        jdbcTemplate.update(insertSql7.toString());

    }

    private String createEntriesSql(String mappingName) {
        StringBuilder sql = new StringBuilder();
        sql.append("INSERT INTO marker (program_name, category, last_synced_date) VALUES ");
        sql.append(String.format("('%s', 'instance', null),", mappingName));
        sql.append(String.format("('%s', 'new_active_enrollment', null),", mappingName));
        sql.append(String.format("('%s', 'new_completed_enrollment', null),", mappingName));
        sql.append(String.format("('%s', 'new_cancelled_enrollment', null),", mappingName));
        sql.append(String.format("('%s', 'updated_active_enrollment', null),", mappingName));
        sql.append(String.format("('%s', 'updated_completed_enrollment', null),", mappingName));
        sql.append(String.format("('%s', 'updated_cancelled_enrollment', null),", mappingName));
        sql.append(String.format("('%s', 'event', null);", mappingName));
        return sql.toString();
    }
}
