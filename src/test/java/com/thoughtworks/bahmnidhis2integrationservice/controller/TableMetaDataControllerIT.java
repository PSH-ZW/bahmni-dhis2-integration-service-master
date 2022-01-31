package com.thoughtworks.bahmnidhis2integrationservice.controller;

import com.thoughtworks.bahmnidhis2integrationservice.BahmniDhis2IntegrationServiceApplication;
import com.thoughtworks.bahmnidhis2integrationservice.SystemPropertyActiveProfileResolver;
import com.thoughtworks.bahmnidhis2integrationservice.config.DbConfig;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = {DbConfig.class, BahmniDhis2IntegrationServiceApplication.class})
@ActiveProfiles(profiles = "test", resolver = SystemPropertyActiveProfileResolver.class)
public class TableMetaDataControllerIT {

    @Autowired
    private TableMetaDataController tableMetaDataController;

    @Test
    public void shouldReturnAllTableNames() {
        System.out.println("shouldReturnAllTableNames");
        List<String> allTableNames = tableMetaDataController.getAllTableNames();

        int expectedTablesCount = 6;
        List<String> expectedTables = Arrays.asList("flyway_schema_history","person_details_default", "patient_identifier", "mapping", "marker", "log");

        assertEquals(expectedTablesCount, allTableNames.size());
        assertTrue(expectedTables.containsAll(allTableNames));
    }

    @Test
    public void shouldReturnAllColumnNamesOfTable() {
        List<String> tableColumns = tableMetaDataController.getAllColumns("patient_identifier");

        int expectedColumnCount = 7;
        List<String> expectedColumn = Arrays.asList("patient_id", "OpenMRS_Identification_Number", "Old_Identification_Number", "Patient_Identifier", "System_ID", "UIC", "PREP_OI_Identifier");

        assertEquals(expectedColumnCount, tableColumns.size());
        assertTrue(expectedColumn.containsAll(tableColumns));
    }
}