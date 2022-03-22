package com.thoughtworks.bahmnidhis2integrationservice.service.impl;

import com.thoughtworks.bahmnidhis2integrationservice.dao.impl.LoggerDAOImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class LoggerServiceImpl {

    @Autowired
    private LoggerDAOImpl loggerDAO;

    public List<Map<String, Object>> getLogs(String date, String user, String service, boolean getAbove, int logId, boolean onLoad, String category) {
        return loggerDAO.getLogs(date, user, service, getAbove, logId, onLoad, category);
    }

    public String getSyncDateForService(String mappingName) {
        return loggerDAO.getLastSuccessfulSyncDateInUTC(mappingName);
    }

    public String getLatestSyncStatus(String mappingName) {
        return loggerDAO.getLatestSyncStatus(mappingName);
    }

//    public List<Map<String, Object>> getAnalyticsLogs(String date, String user, String service, boolean getAbove,
//                                                      int logId, boolean onLoad, String category) {
//        return loggerDAO.getAnalyticsLogs(date, user, getAbove, logId, onLoad, category);
//    }
}
