package com.thoughtworks.bahmnidhis2integrationservice.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface PreviewService {
    List<Map<String, Object>> getDeltaData(String mappingName);
    List<Map<String, Object>> getDeltaDataForDateRange(String mappingName, Date startDate, Date endDate);
}
