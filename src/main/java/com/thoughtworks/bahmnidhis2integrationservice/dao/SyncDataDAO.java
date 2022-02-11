package com.thoughtworks.bahmnidhis2integrationservice.dao;

import java.util.List;
import java.util.Map;

public interface SyncDataDAO {
    List<Map<String, Object>> getEventsLeftToSync();
}
