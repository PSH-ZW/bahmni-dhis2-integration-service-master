package com.thoughtworks.bahmnidhis2integrationservice.controller;

import com.thoughtworks.bahmnidhis2integrationservice.service.impl.LoggerServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api")
public class LoggerController {

    @Autowired
    private LoggerServiceImpl loggerService;

    @GetMapping(value = "/syncLogs")
    @ResponseBody
    public List<Map<String, Object>> getLogs(@RequestParam String date,
                                             @RequestParam String user,
                                             @RequestParam String service,
                                             @RequestParam boolean getAbove,
                                             @RequestParam int logId,
                                             @RequestParam boolean onLoad
//                                             @RequestParam(defaultValue = "dhis-sync") String category
    ){
        return loggerService.getLogs(date, user, service, getAbove, logId, onLoad);
    }

    @GetMapping(value = "/analyticsLogs")
    @ResponseBody
    public List<Map<String, Object>> getLogs(@RequestParam String date,
                                             @RequestParam String service,
                                             @RequestParam boolean getAbove,
                                             @RequestParam int logId,
                                             @RequestParam boolean onLoad,
                                             @RequestParam(defaultValue = "") String status
//                                             @RequestParam(defaultValue = "analytics") String category
    ){
        return loggerService.getAnalyticsLogs(date, service, getAbove, logId, onLoad, status);
    }
}
