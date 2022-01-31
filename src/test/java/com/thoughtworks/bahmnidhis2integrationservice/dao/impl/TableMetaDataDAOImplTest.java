package com.thoughtworks.bahmnidhis2integrationservice.dao.impl;

import org.junit.Assert;
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
public class TableMetaDataDAOImplTest {

    private TableMetaDataDAOImpl tableMetaDataDAO;

    @Mock
    private JdbcTemplate jdbcTemplate;

    @Before
    public void setUp() throws Exception {
        tableMetaDataDAO = new TableMetaDataDAOImpl();
        setValuesForMemberFields(tableMetaDataDAO, "jdbcTemplate", jdbcTemplate);
    }

    @Test
    public void shouldGetAllTheTables() {
        String sql = "SELECT table_name FROM INFORMATION_SCHEMA.TABLES where TABLE_SCHEMA='public'";
        Map<String, Object> map1 = new HashMap<>();
        map1.put("table_name", "patient");
        Map<String, Object> map2 = new HashMap<>();
        map2.put("table_name", "hts_table");
        Map<String, Object> map3 = new HashMap<>();
        map3.put("table_name", "program");
        List<Map<String, Object>> results = Arrays.asList(map1, map2, map3);

        List<String> expected = Arrays.asList("patient", "hts_table", "program");

        when(jdbcTemplate.queryForList(sql)).thenReturn(results);

        Assert.assertEquals(expected, tableMetaDataDAO.getAllTableNames());
        verify(jdbcTemplate, times(1)).queryForList(sql);
    }

    @Test
    public void shouldReturnAllColumnNamesOfATable() {
        String tableName = "hts_program";
        String sql = "SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='public' AND TABLE_NAME='hts_program'";

        Map<String, Object> map1 = new HashMap<>();
        map1.put("column_name", "UIC");
        Map<String, Object> map2 = new HashMap<>();
        map2.put("column_name", "patient_name");
        Map<String, Object> map3 = new HashMap<>();
        map3.put("column_name", "program_id");

        List<Map<String, Object>> results = Arrays.asList(map1, map2, map3);

        List<String> expected = Arrays.asList("UIC", "patient_name", "program_id");

        when(jdbcTemplate.queryForList(sql)).thenReturn(results);

        Assert.assertEquals(expected, tableMetaDataDAO.getAllColumns(tableName));

        verify(jdbcTemplate, times(1)).queryForList(sql);
    }
}