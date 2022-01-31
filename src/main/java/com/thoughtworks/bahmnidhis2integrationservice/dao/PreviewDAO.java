package com.thoughtworks.bahmnidhis2integrationservice.dao;

import java.sql.SQLException;
import java.util.Date;
import java.util.List;
import java.util.Map;

public interface PreviewDAO {
    List<Map<String, Object>> getDeltaData(String deltaDataSql) throws SQLException;
    List<Map<String, Object>> getDeltaDataForDateRange(String mappingName, Date startDate, Date endDate) throws SQLException;
}
