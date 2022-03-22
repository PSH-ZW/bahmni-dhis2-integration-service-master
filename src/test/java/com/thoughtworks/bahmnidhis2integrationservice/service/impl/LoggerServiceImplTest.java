package com.thoughtworks.bahmnidhis2integrationservice.service.impl;

import com.thoughtworks.bahmnidhis2integrationservice.dao.impl.LoggerDAOImpl;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.powermock.modules.junit4.PowerMockRunner;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.thoughtworks.bahmnidhis2integrationservice.CommonTestHelper.setValuesForMemberFields;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.powermock.api.mockito.PowerMockito.when;

@RunWith(PowerMockRunner.class)
public class LoggerServiceImplTest {

    @Mock
    private LoggerDAOImpl loggerDAO;

    private LoggerServiceImpl loggerService;
    private boolean onLoad = false;

    @Before
    public void setUp() throws Exception {
        loggerService = new LoggerServiceImpl();
        setValuesForMemberFields(loggerService, "loggerDAO", loggerDAO);
    }

    @Test
    public void shouldMakeACallToLogDAOToGetLastSuccessfulSyncDate() {
        String mappingName = "My service";

        Mockito.when(loggerDAO.getLastSuccessfulSyncDateInUTC(mappingName)).thenReturn("2018-10-03 11:21:32.000000");

        loggerService.getSyncDateForService(mappingName);

        verify(loggerDAO, times(1)).getLastSuccessfulSyncDateInUTC(mappingName);
    }

    @Test
    public void shouldMakeACallToLogDAOToGetLatestSyncStatus() {
        String mappingName = "My service";

        Mockito.when(loggerDAO.getLatestSyncStatus(mappingName)).thenReturn("success");

        loggerService.getSyncDateForService(mappingName);

        verify(loggerDAO, times(1)).getLastSuccessfulSyncDateInUTC(mappingName);
    }

    @Test
    public void shouldCallLoggerDAOGetLogs() {
        String date = "2018-10-11 00:00:00";
        Map<String, Object> expRow1 = new HashMap<>();
        Map<String, Object> expRow2 = new HashMap<>();
        expRow1.put("date_created", date);
        expRow1.put("synced_by", "superman");
        expRow1.put("program_name", "HT Service");
        expRow2.put("date_created", "2018-11-01 14:00:00");
        expRow2.put("synced_by", "admin");
        expRow2.put("program_name", "HT Service");
        List<Map<String, Object>> expResults = Arrays.asList(expRow1, expRow2);

        when(loggerDAO.getLogs(date, "", "", true, 0, onLoad, "")).thenReturn(expResults);

        List<Map<String, Object>> actualResults = loggerService.getLogs(date, "", "", true, 0, onLoad, "");

        verify(loggerDAO, times(1)).getLogs(date, "", "", true, 0, onLoad, "");

        assertEquals(expResults, actualResults);
    }
}
