package com.thoughtworks.bahmnidhis2integrationservice.controller;

import com.thoughtworks.bahmnidhis2integrationservice.service.impl.TableMetaDataServiceImpl;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.powermock.modules.junit4.PowerMockRunner;

import java.util.Arrays;
import java.util.List;

import static com.thoughtworks.bahmnidhis2integrationservice.CommonTestHelper.setValuesForMemberFields;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.powermock.api.mockito.PowerMockito.when;

@RunWith(PowerMockRunner.class)
public class TableMetaDataControllerTest {

    @Mock
    private TableMetaDataServiceImpl tableMetaDataService;

    private TableMetaDataController tableMetaDataController;

    @Before
    public void setUp() throws Exception {
        tableMetaDataController = new TableMetaDataController();
        setValuesForMemberFields(tableMetaDataController, "tableMetaDataService", tableMetaDataService);
    }

    @Test
    public void getAllTables() {
        List<String> expectedList = Arrays.asList("patient", "hts_program", "events");
        when(tableMetaDataService.getAllTableNames()).thenReturn(expectedList);
        List<String> allTable = tableMetaDataController.getAllTableNames();

        Assert.assertEquals(expectedList, allTable);
        verify(tableMetaDataService, times(1)).getAllTableNames();
    }
    
    @Test
    public void getAllColumns() {
        String tableName = "hts_table";

        List<String> expectedList = Arrays.asList("UIC", "patient_name", "program_id");
        when(tableMetaDataService.getAllColumns(tableName)).thenReturn(expectedList);
        List<String> allColumns = tableMetaDataController.getAllColumns(tableName);

        Assert.assertEquals(expectedList, allColumns);
        verify(tableMetaDataService, times(1)).getAllColumns(tableName);
    }
}