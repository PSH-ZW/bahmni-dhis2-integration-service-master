package com.thoughtworks.bahmnidhis2integrationservice.service.impl;

import com.thoughtworks.bahmnidhis2integrationservice.repository.SyncRepository;
import com.thoughtworks.bahmnidhis2integrationservice.service.SyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SyncServiceImpl implements SyncService {

    @Autowired
    private SyncRepository syncRepository;

    @Override
    public void sync(String body) throws Exception {
        syncRepository.sync(body);
    }
}
