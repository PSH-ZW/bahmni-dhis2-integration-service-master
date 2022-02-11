package com.thoughtworks.bahmnidhis2integrationservice.controller;

import com.thoughtworks.bahmnidhis2integrationservice.model.KeyValue;
import com.thoughtworks.bahmnidhis2integrationservice.service.SyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/api")
public class SyncDataController {

    @Autowired
    private SyncService syncService;

    @GetMapping(value = "/syncProgress")
    @ResponseBody
    public List<KeyValue<String, String >> getSyncProgress() {
        return syncService.getCountOfEventsLeftToSync();
    }
}
