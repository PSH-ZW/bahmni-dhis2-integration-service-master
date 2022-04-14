package com.thoughtworks.bahmnidhis2integrationservice.controller;

import com.thoughtworks.bahmnidhis2integrationservice.BahmniDhis2IntegrationServiceApplication;
import com.thoughtworks.bahmnidhis2integrationservice.SystemPropertyActiveProfileResolver;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;


@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = BahmniDhis2IntegrationServiceApplication.class)
@ActiveProfiles(profiles = "test", resolver = SystemPropertyActiveProfileResolver.class)
public class LoggerControllerIT {

    @Autowired
    private LoggerController loggerController;

    //All tests might fail in different timezone. Works for only IST timezone

    @Ignore
    @Test
    public void shouldGetAllLogsAboveTheGivenDate() {
        String date = "2018-11-04 00:00:00.000000";
        List<Map<String, Object>> logs = loggerController.getLogs(date, "", "", true, 0, true, "");

        assertEquals(1, logs.size());
        assertEquals(14, logs.get(0).get("log_id"));
        assertEquals("FPS Service", logs.get(0).get("program"));
        assertEquals("admin", logs.get(0).get("synced_by"));
        assertEquals("FPS failed sync", logs.get(0).get("comments"));
        assertEquals("failed", logs.get(0).get("status"));
        assertEquals("", logs.get(0).get("status_info"));
        assertEquals("2018-11-04 05:58:32", logs.get(0).get("date_created"));
    }

    @Ignore
    @Test
    public void shouldGetAllLogsAboveTheGivenDateWithUserAdmin() {
        String date = "2018-10-04 00:00:00.000000";
        List<Map<String, Object>> logs = loggerController.getLogs(date, "admin", "", true, 0, false, "");
        assertEquals(2, logs.size());
        assertEquals("admin", logs.get(0).get("synced_by"));
        assertEquals("admin", logs.get(1).get("synced_by"));
    }

    @Ignore
    @Test
    public void shouldGetAllLogsAboveTheGivenDateWithProgramFPSServiceAndAdminUser() {
        String date = "2018-10-04 00:00:00.000000";
        List<Map<String, Object>> logs = loggerController.getLogs(date, "admin", "FPS Service", true, 0, false, "");
        assertEquals(1, logs.size());
        assertEquals("admin", logs.get(0).get("synced_by"));
        assertEquals("FPS Service", logs.get(0).get("program"));
    }

    @Ignore
    @Test
    public void shouldGetAllLogsAboveTheGivenDateWithProgramFPSService() {
        String date = "2018-10-04 00:00:00.000000";
        List<Map<String, Object>> logs = loggerController.getLogs(date, "", "FPS Service", true, 0, false, "");
        assertEquals(2, logs.size());
        assertEquals("FPS Service", logs.get(0).get("program"));
        assertEquals("FPS Service", logs.get(1).get("program"));
    }

    @Ignore
    @Test
    public void shouldGetAllLogsBelowTheGivenDate() {
        String date = "2018-10-04 00:00:00.000000";
        List<Map<String, Object>> logs = loggerController.getLogs(date, "", "", false, 14, false, "");
        assertEquals(3, logs.size());
        assertEquals("2018-10-04 05:58:32", logs.get(0).get("date_created"));
        assertEquals("2018-10-04 05:54:32", logs.get(1).get("date_created"));
        assertEquals("2018-10-04 05:51:32", logs.get(2).get("date_created"));
    }

    @Ignore
    @Test
    public void shouldGetAllLogsAboveTheGivenDateWhenOnLoadIsFalse() {
        String date = "2018-10-04 00:00:00.000000";
        List<Map<String, Object>> logs = loggerController.getLogs(date, "", "", true, 11, false, "");
        assertEquals(3, logs.size());
        assertEquals("2018-10-04 05:54:32", logs.get(0).get("date_created"));
        assertEquals("2018-10-04 05:58:32", logs.get(1).get("date_created"));
        assertEquals("2018-11-04 05:58:32", logs.get(2).get("date_created"));
    }
}
