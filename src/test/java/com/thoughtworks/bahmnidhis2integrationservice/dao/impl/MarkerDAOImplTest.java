package com.thoughtworks.bahmnidhis2integrationservice.dao.impl;

import com.thoughtworks.bahmnidhis2integrationservice.model.Mapping;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.powermock.modules.junit4.PowerMockRunner;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.thoughtworks.bahmnidhis2integrationservice.CommonTestHelper.setValuesForMemberFields;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.powermock.api.mockito.PowerMockito.when;

@RunWith(PowerMockRunner.class)
public class MarkerDAOImplTest {

    private MarkerDAOImpl markerDAO;

    @Mock
    private JdbcTemplate jdbcTemplate;

    @Before
    public void setUp() throws Exception {
        markerDAO = new MarkerDAOImpl();
        setValuesForMemberFields(markerDAO, "jdbcTemplate", jdbcTemplate);
    }

    @Test
    public void shouldInsertEntriesForNewService() {
        String oldMappingName = "";
        String programName = "Dummabus Service";

        StringBuilder sql = new StringBuilder();
        sql.append("INSERT INTO marker (program_name, category, last_synced_date) VALUES ");
        sql.append(String.format("('%s', 'instance', null),", programName));
        sql.append(String.format("('%s', 'new_active_enrollment', null),", programName));
        sql.append(String.format("('%s', 'new_completed_enrollment', null),", programName));
        sql.append(String.format("('%s', 'new_cancelled_enrollment', null),", programName));
        sql.append(String.format("('%s', 'updated_active_enrollment', null),", programName));
        sql.append(String.format("('%s', 'updated_completed_enrollment', null),", programName));
        sql.append(String.format("('%s', 'updated_cancelled_enrollment', null),", programName));
        sql.append(String.format("('%s', 'event', null)", programName));

        when(jdbcTemplate.update(sql.toString())).thenReturn(3);

        markerDAO.createMarkerEntries(oldMappingName, programName);

        verify(jdbcTemplate, times(1)).update(sql.toString());
    }

    @Test
    public void shouldNotInsertEntriesWhenServiceIsAlreadyExists() {


        String oldMappingName = "Dummabus Service";
        String programName = "Dummabus Service";
        Map<String, Object> entriesCount = new HashMap<>();
        entriesCount.put("count", 6);
        String deleteSql = String.format("delete from marker where program_name = '%s' and category = 'enrollment'", oldMappingName);
        String insertSql1 = String.format("INSERT INTO marker (program_name, category, last_synced_date)\n" +
                "SELECT '%s' AS program_name, 'new_active_enrollment' AS category, null as last_synced_date FROM marker\n" +
                "WHERE NOT EXISTS(SELECT category FROM marker WHERE program_name = '%s' and category = 'new_active_enrollment')LIMIT 1", oldMappingName, programName);
        String insertSql2 = String.format("INSERT INTO marker (program_name, category, last_synced_date)\n" +
                "SELECT '%s' AS program_name, 'new_completed_enrollment' AS category, null as last_synced_date FROM marker\n" +
                "WHERE NOT EXISTS(SELECT category FROM marker WHERE program_name = '%s' and category = 'new_completed_enrollment')LIMIT 1", oldMappingName, programName);
        String insertSql5 = String.format("INSERT INTO marker (program_name, category, last_synced_date)\n" +
                "SELECT '%s' AS program_name, 'new_cancelled_enrollment' AS category, null as last_synced_date FROM marker\n" +
                "WHERE NOT EXISTS(SELECT category FROM marker WHERE program_name = '%s' and category = 'new_cancelled_enrollment')LIMIT 1", oldMappingName, programName);
        String insertSql3 = String.format("INSERT INTO marker (program_name, category, last_synced_date)\n" +
                "SELECT '%s' AS program_name, 'updated_active_enrollment' AS category, null as last_synced_date FROM marker\n" +
                "WHERE NOT EXISTS(SELECT category FROM marker WHERE program_name = '%s' and category = 'updated_active_enrollment')LIMIT 1", oldMappingName, programName);
        String insertSql4 = String.format("INSERT INTO marker (program_name, category, last_synced_date)\n" +
                "SELECT '%s' AS program_name, 'updated_completed_enrollment' AS category, null as last_synced_date FROM marker\n" +
                "WHERE NOT EXISTS(SELECT category FROM marker WHERE program_name = '%s' and category = 'updated_completed_enrollment')LIMIT 1", oldMappingName, programName);
        String insertSql6 = String.format("INSERT INTO marker (program_name, category, last_synced_date)\n" +
                "SELECT '%s' AS program_name, 'updated_cancelled_enrollment' AS category, null as last_synced_date FROM marker\n" +
                "WHERE NOT EXISTS(SELECT category FROM marker WHERE program_name = '%s' and category = 'updated_cancelled_enrollment')LIMIT 1", oldMappingName, programName);
        String existenceCheckSql = String.format("SELECT count(*) FROM marker WHERE program_name = '%s'", programName);
        when(jdbcTemplate.queryForMap(existenceCheckSql)).thenReturn(entriesCount);

        markerDAO.createMarkerEntries(oldMappingName, programName);

        //verify(jdbcTemplate, times(2)).queryForMap(existenceCheckSql);
        verify(jdbcTemplate, times(1)).update(deleteSql.toString());
        verify(jdbcTemplate, times(1)).update(insertSql1.toString());
        verify(jdbcTemplate, times(1)).update(insertSql2.toString());
        verify(jdbcTemplate, times(1)).update(insertSql3.toString());
        verify(jdbcTemplate, times(1)).update(insertSql4.toString());
        verify(jdbcTemplate, times(1)).update(insertSql5.toString());
        verify(jdbcTemplate, times(1)).update(insertSql6.toString());

    }

    @Test
    public void shouldUpdateEntriesWhenServiceNameIsModified() {

        String oldMappingName = "Dummabus";
        String newMappingName = "Dummabus Service";
        Map<String, Object> entriesCount = new HashMap<>();
        entriesCount.put("count", 0);
        String existenceCheckSql = String.format("SELECT count(*) FROM marker WHERE program_name = '%s'", newMappingName);
        String sql = String.format("UPDATE marker SET program_name='%s' WHERE program_name='%s'"
                , newMappingName, oldMappingName);

        when(jdbcTemplate.queryForMap(existenceCheckSql)).thenReturn(entriesCount);
        when(jdbcTemplate.update(sql)).thenReturn(0);

        markerDAO.createMarkerEntries(oldMappingName, newMappingName);

        //verify(jdbcTemplate, times(2)).queryForMap(existenceCheckSql);
        verify(jdbcTemplate, times(1)).update(sql);

    }

    @Test
    public void shouldGetInsertSqlWhenCurrentMappingIsEmpty() {
        String insertMapping = "insert mapping";
        String updateMapping = "update mapping";
        Map<String, Object> entriesCount = new HashMap<>();
        entriesCount.put("count", 3);

        Mapping mapping1 = new Mapping(insertMapping, "", "", "", "", "superman");
        Mapping mapping2 = new Mapping(updateMapping, updateMapping, "", "", "", "superman");
        List<Mapping> mappings = Arrays.asList(mapping1, mapping2);

        StringBuilder insertSql = new StringBuilder();
        insertSql.append("INSERT INTO marker (program_name, category, last_synced_date) VALUES ");
        insertSql.append(String.format("('%s', 'instance', null),", insertMapping));
        insertSql.append(String.format("('%s', 'new_active_enrollment', null),", insertMapping));
        insertSql.append(String.format("('%s', 'new_completed_enrollment', null),", insertMapping));
        insertSql.append(String.format("('%s', 'new_cancelled_enrollment', null),", insertMapping));
        insertSql.append(String.format("('%s', 'updated_active_enrollment', null),", insertMapping));
        insertSql.append(String.format("('%s', 'updated_completed_enrollment', null),", insertMapping));
        insertSql.append(String.format("('%s', 'updated_cancelled_enrollment', null),", insertMapping));
        insertSql.append(String.format("('%s', 'event', null);", insertMapping));

        String existenceCheckSql = String.format("SELECT count(*) FROM marker WHERE program_name = '%s'", updateMapping);

        when(jdbcTemplate.queryForMap(existenceCheckSql)).thenReturn(entriesCount);
        when(jdbcTemplate.update(insertSql.toString())).thenReturn(3);

        markerDAO.createMarkerEntries(mappings);

        verify(jdbcTemplate, times(1)).update(insertSql.toString());
    }
}
