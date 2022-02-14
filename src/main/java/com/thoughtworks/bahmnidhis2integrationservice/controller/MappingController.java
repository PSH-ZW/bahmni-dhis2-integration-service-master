package com.thoughtworks.bahmnidhis2integrationservice.controller;

import com.google.gson.Gson;
import com.thoughtworks.bahmnidhis2integrationservice.exception.NoMappingFoundException;
import com.thoughtworks.bahmnidhis2integrationservice.model.Mapping;
import com.thoughtworks.bahmnidhis2integrationservice.model.MappingDetails;
import com.thoughtworks.bahmnidhis2integrationservice.service.impl.LoggerServiceImpl;
import com.thoughtworks.bahmnidhis2integrationservice.service.impl.MappingServiceImpl;
import com.thoughtworks.bahmnidhis2integrationservice.service.impl.MarkerServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/api")
public class MappingController {

    @Autowired
    private MappingServiceImpl mappingService;

    @Autowired
    private MarkerServiceImpl markerService;

    @Autowired
    private LoggerServiceImpl logService;

    @PutMapping(value = "/saveMapping")
    @ResponseBody
    public Map<String, String> saveMappings(@RequestBody Map<String, String> params) throws Exception {
        String response = mappingService.saveMapping(params.get("mappingName"),
                params.get("lookupTable"),
                params.get("mappingJson"),
                params.get("config"),
                params.get("currentMapping"),
                params.get("user"));
        markerService.createEntriesForNewService(params.get("currentMapping"), params.get("mappingName"));

        Map<String, String> responseObj = new HashMap<>();

        responseObj.put("data", response);

        return responseObj;
    }

    @GetMapping(value = "/getMappingNames")
    @ResponseBody
    public List<String> getAllMappingNames() {
        return mappingService.getMappingNames();
    }

    @GetMapping(value = "/getMappingsSyncInfo")
    @ResponseBody
    public Map<String, MappingDetails> getAllMappingsSyncInfo() {

        Map<String, MappingDetails> response = new HashMap<>();

        List<String> mappingNames = mappingService.getMappingNames();

        mappingNames.forEach(mapping -> {
            MappingDetails mappingDetails = new MappingDetails(
                    logService.getSyncDateForService(mapping), logService.getLatestSyncStatus(mapping),false,null,null);
            response.put(mapping, mappingDetails);
        });

        return response;
    }

    @GetMapping(value = "/getMapping")
    @ResponseBody
    public Map<String, Object> getMapping(String mappingName) throws NoMappingFoundException {
        return mappingService.getMapping(mappingName);
    }

    @GetMapping(value = "/getAllMappings")
    @ResponseBody
    public List<Map<String, Object>> getAllMappings() throws NoMappingFoundException {
        return mappingService.getAllMappings();
    }

    @PutMapping(value = "/mappings")
    @ResponseBody
    public Map<String, String> saveMappings(@RequestBody List<Object> params) throws Exception {
        Gson gson = new Gson();

        List<Mapping> mappingList = params.stream()
                .map(mappingObj -> gson.fromJson(mappingObj.toString(), Mapping.class))
                .collect(Collectors.toList());
        String response = mappingService.saveMapping(mappingList);
        markerService.createMarkerEntries(mappingList);

        Map<String, String> responseObj = new HashMap<>();
        responseObj.put("data", response);

        return responseObj;
    }

    @GetMapping("/searchDataElements")
    @ResponseBody
    public List<Map<String, String>> searchDataElements(@RequestParam String searchString) {
        return mappingService.searchForDataElement(searchString);
    }

    @GetMapping("/searchTrackedEntityAttributes")
    @ResponseBody
    public List<Map<String, String>> searchTrackedEntityAttributes(@RequestParam String searchString) {
        return mappingService.searchTrackedEntityAttribute(searchString);
    }

    @GetMapping("/getProgramStages")
    @ResponseBody
    public List<Map<String, String>> getProgramStages() {
        return mappingService.getProgramStages();
    }
}
