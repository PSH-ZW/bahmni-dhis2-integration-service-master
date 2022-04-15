package com.thoughtworks.bahmnidhis2integrationservice.dao.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

import static com.thoughtworks.bahmnidhis2integrationservice.util.DateUtil.getDateStringInLocalFromUtc;
import static com.thoughtworks.bahmnidhis2integrationservice.util.DateUtil.getDateStringInUTC;

@Component
public class LoggerDAOImpl {

    @Autowired
    @Qualifier("jdbcTemplate")
    private JdbcTemplate jdbcTemplate;

    private static final String DATE_CREATED = "date_created";
    private static final String SUCCESS = "success";
    private static final String EMPTY_STATUS = "";
    private static final String CATEGORY_SYNC_LOGS = "dhis-sync";
    private static final String CATEGORY_ANALYTICS = "analytics";


    public List<Map<String, Object>> getLogs(String date, String status, String service, boolean getAbove, int logId, boolean onLoad) {
        ZoneId zoneId = ZonedDateTime.now().getZone();
        String serverDate = getDateStringInLocalFromUtc(date, zoneId);
        String sql = String.format(getSql(getAbove, onLoad), serverDate, status, service, logId, CATEGORY_SYNC_LOGS);
        List<Map<String, Object>> logs = jdbcTemplate.queryForList(sql);
        changeDateToUtc(logs, zoneId);
        return logs;
    }

    public String getLastSuccessfulSyncDateInUTC(String mappingName) {

        String dateInString = "";

        String sql = String.format("SELECT max(date_created) from log where program = '%s' AND status = '%s';", mappingName, SUCCESS);
        Object maxDateCreated = jdbcTemplate.queryForList(sql).get(0).get("max");
        if (maxDateCreated != null) {
            dateInString = getDateStringInUTC(String.valueOf(maxDateCreated), ZonedDateTime.now().getZone());
        }
        return dateInString;
    }

    public String getLatestSyncStatus(String mappingName) {

        String sql = String.format("SELECT status from log where program = '%s' ORDER BY date_created desc LIMIT 1;", mappingName);
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
        if (list.isEmpty()) {
            return EMPTY_STATUS;
        }
        return (String) list.get(0).get("status");
    }

    private void changeDateToUtc(List<Map<String, Object>> logs, ZoneId zoneId) {
        logs.forEach(log -> {
            String currentDate = log.get(DATE_CREATED).toString();
            log.put(DATE_CREATED, getDateStringInUTC(currentDate, zoneId));
        });
    }

    private String getSql(boolean getAbove, boolean onLoad) {
        if (onLoad) {
            return getOnLoadPageSqlWithStatus();
        }
        if (getAbove) {
            return getPrevPageSqlWithStatus();
        }
        return getNextPageSqlWithStatus();
    }

    private String getNextPageSqlWithStatus() {
        return "SELECT log_id, program, synced_by, comments, status, status_info, date_created \n" +
                "FROM log \n" +
                "WHERE date_created >= '%s' \n" +
                "AND upper(status) LIKE upper('%%%s%%') \n" +
                "AND upper(program) LIKE upper('%%%s%%')\n" +
                "AND log_id < %s\n" +
                "AND category = '%s' \n" +
                "ORDER BY log_id DESC LIMIT 10;";
    }

    private String getPrevPageSqlWithStatus() {
        return "SELECT log_id, program, synced_by, comments, status, status_info, date_created \n" +
                "FROM log \n" +
                "WHERE date_created >= '%s' \n" +
                "AND upper(status) LIKE upper('%%%s%%') \n" +
                "AND upper(program) LIKE upper('%%%s%%')\n" +
                "AND log_id > %s\n" +
                "AND category = '%s' \n" +
                "ORDER BY log_id ASC LIMIT 10;";
    }

    private String getOnLoadPageSqlWithStatus() {
        return "SELECT log_id, program, synced_by, comments, status, status_info, date_created \n" +
                "FROM log \n" +
                "WHERE date_created >= '%s' \n" +
                "AND upper(status) LIKE upper('%%%s%%') \n" +
                "AND upper(program) LIKE upper('%%%s%%')\n" +
                "AND log_id > %s\n" +
                "AND category = '%s' \n" +
                "ORDER BY log_id DESC LIMIT 10;";
    }

    public List<Map<String, Object>> getAnalyticsLogs(String date, String service, boolean getAbove, int logId,
                                                      boolean onLoad, String status) {
        ZoneId zoneId = ZonedDateTime.now().getZone();
        String serverDate = getDateStringInLocalFromUtc(date, zoneId);
        String sql;
        if(!status.isEmpty()) {
            sql = String.format(getAnalyticsSql(getAbove, onLoad, false), serverDate, service, logId,
                    CATEGORY_ANALYTICS, status);
        }else{
            sql = String.format(getAnalyticsSql(getAbove, onLoad, true), serverDate, service, logId,
                    CATEGORY_ANALYTICS);
        }
        List<Map<String, Object>> logs = jdbcTemplate.queryForList(sql);
        changeDateToUtc(logs, zoneId);
        return logs;
    }

    private String getAnalyticsSql(boolean getAbove, boolean onLoad, boolean defaultCase) {
        if (onLoad) {
            if(defaultCase) return getOnLoadPageAnalyticsSqlDefault();
            return getOnLoadPageAnalyticsSql();
        }
        if (getAbove) {
            if(defaultCase) return getPrevPageAnalyticsSqlDefault();
            return getPrevPageAnalyticsSql();
        }
        if(defaultCase) return getNextPageAnalyticsSqlDefault();
        return getNextPageAnalyticsSql();
    }

    private String getNextPageAnalyticsSqlDefault() {
        return "SELECT log_id, program, synced_by, comments, status, status_info, date_created \n" +
                "FROM log \n" +
                "WHERE date_created >= '%s' \n" +
                "AND upper(program) LIKE upper('%%%s%%')\n" +
                "AND log_id < %s\n" +
                "AND category = '%s' \n" +
                "ORDER BY log_id DESC LIMIT 10;";
    }

    private String getPrevPageAnalyticsSqlDefault() {
        return "SELECT log_id, program, synced_by, comments, status, status_info, date_created \n" +
                "FROM log \n" +
                "WHERE date_created >= '%s' \n" +
                "AND upper(program) LIKE upper('%%%s%%')\n" +
                "AND log_id > %s\n" +
                "AND category = '%s' \n" +
                "ORDER BY log_id ASC LIMIT 10;";
    }

    private String getNextPageAnalyticsSql() {
        return "SELECT log_id, program, synced_by, comments, status, status_info, date_created \n" +
                "FROM log \n" +
                "WHERE date_created >= '%s' \n" +
                "AND upper(program) LIKE upper('%%%s%%')\n" +
                "AND log_id < %s\n" +
                "AND category = '%s' \n" +
                "AND status = '%s' \n" +
                "ORDER BY log_id DESC LIMIT 10;";
    }

    private String getPrevPageAnalyticsSql() {
        return "SELECT log_id, program, synced_by, comments, status, status_info, date_created \n" +
                "FROM log \n" +
                "WHERE date_created >= '%s' \n" +
                "AND upper(program) LIKE upper('%%%s%%')\n" +
                "AND log_id > %s\n" +
                "AND category = '%s' \n" +
                "AND status = '%s' \n" +
                "ORDER BY log_id ASC LIMIT 10;";
    }

    private String getOnLoadPageAnalyticsSql() {
        return "SELECT log_id, program, comments, status, status_info, date_created \n" +
                "FROM log \n" +
                "WHERE date_created >= '%s' \n" +
                "AND upper(program) LIKE upper('%%%s%%')\n" +
                "AND log_id > %s\n" +
                "AND category = '%s' \n" +
                "AND status = '%s' \n" +
                "ORDER BY log_id DESC LIMIT 10;";
    }
    private String getOnLoadPageAnalyticsSqlDefault() {
        return "SELECT log_id, program, comments, status, status_info, date_created \n" +
                "FROM log \n" +
                "WHERE date_created >= '%s' \n" +
                "AND upper(program) LIKE upper('%%%s%%')\n" +
                "AND log_id > %s\n" +
                "AND category = '%s' \n" +
                "ORDER BY log_id DESC LIMIT 10;";
    }
}
