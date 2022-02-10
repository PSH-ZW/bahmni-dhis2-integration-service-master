package com.thoughtworks.bahmnidhis2integrationservice.service.impl;

import com.thoughtworks.bahmnidhis2integrationservice.repository.SyncRepository;
import com.thoughtworks.bahmnidhis2integrationservice.service.SyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class SyncServiceImpl implements SyncService {

    @Autowired
    private SyncRepository syncRepository;

    @Override
    public List<Map<String, String>> searchDataElements(String body) throws Exception {
        syncRepository.searchDataElements(body);
        return null;
    }
}
