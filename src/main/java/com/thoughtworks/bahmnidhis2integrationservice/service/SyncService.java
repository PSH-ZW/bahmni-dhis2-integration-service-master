package com.thoughtworks.bahmnidhis2integrationservice.service;

import com.thoughtworks.bahmnidhis2integrationservice.model.KeyValue;

import java.util.List;
import java.util.Map;

public interface SyncService {
    List<Map<String, String>> searchDataElements(String body) throws Exception;
    List<KeyValue<String, String>> getCountOfEventsLeftToSync();
}
