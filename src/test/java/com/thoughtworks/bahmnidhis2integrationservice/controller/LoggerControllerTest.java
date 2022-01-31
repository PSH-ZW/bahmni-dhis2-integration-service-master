package com.thoughtworks.bahmnidhis2integrationservice.controller;

import com.thoughtworks.bahmnidhis2integrationservice.service.impl.LoggerServiceImpl;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
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
public class LoggerControllerTest {

    @Mock
    private LoggerServiceImpl loggerService;

    private LoggerController loggerController;

    @Before
    public void setUp() throws Exception {
        loggerController = new LoggerController();
        setValuesForMemberFields(loggerController, "loggerService", loggerService);
    }

    @Test
    public void shouldCallServiceGetLogs() {
        String date = "2018-10-11 01:00:00";
        boolean onLoad = false;
        Map<String, Object> expRow1 = new HashMap<>();
        Map<String, Object> expRow2 = new HashMap<>();
        expRow1.put("date_created", date);
        expRow1.put("synced_by", "superman");
        expRow1.put("program_name", "HT Service");
        expRow2.put("date_created", "2018-11-01 14:00:00");
        expRow2.put("synced_by", "admin");
        expRow2.put("program_name", "HT Service");
        List<Map<String, Object>> expResults = Arrays.asList(expRow1, expRow2);

        when(loggerService.getLogs(date, "", "", true, 0, onLoad)).thenReturn(expResults);

        List<Map<String, Object>> actualResults = loggerController.getLogs(date, "", "", true, 0, onLoad);

        verify(loggerService, times(1)).getLogs(date, "", "", true, 0, onLoad);

        assertEquals(expResults, actualResults);
    }
}
