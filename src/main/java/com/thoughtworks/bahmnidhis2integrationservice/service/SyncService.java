package com.thoughtworks.bahmnidhis2integrationservice.service;

import com.thoughtworks.bahmnidhis2integrationservice.model.KeyValue;

import java.util.List;

public interface SyncService {
    List<KeyValue<String, String>> getCountOfEventsLeftToSync();
}
