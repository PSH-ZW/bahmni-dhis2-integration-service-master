package com.thoughtworks.bahmnidhis2integrationservice.service.impl;

import com.thoughtworks.bahmnidhis2integrationservice.dao.SyncDataDAO;
import com.thoughtworks.bahmnidhis2integrationservice.model.KeyValue;
import com.thoughtworks.bahmnidhis2integrationservice.repository.SyncRepository;
import com.thoughtworks.bahmnidhis2integrationservice.service.SyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class SyncServiceImpl implements SyncService {

    @Autowired
    private SyncRepository syncRepository;

    @Autowired
    private SyncDataDAO syncDataDAO;

    @Override
    public List<Map<String, String>> searchDataElements(String body) throws Exception {
        syncRepository.searchDataElements(body);
        return null;
    }

    @Override
    public List<KeyValue<String, String>> getCountOfEventsLeftToSync() {
        List<Map<String, Object>> remainingCountDataForAllPrograms = syncDataDAO.getEventsLeftToSync();
        List<KeyValue<String, String>> programCountKeyValues = new ArrayList<>();
        for (Map<String, Object> remainingCountData : remainingCountDataForAllPrograms) {
            programCountKeyValues.add(new KeyValue<>(remainingCountData.get("program_id").toString(),
                    remainingCountData.get("events_left_to_sync").toString()));
        }
        return programCountKeyValues;
    }
}
