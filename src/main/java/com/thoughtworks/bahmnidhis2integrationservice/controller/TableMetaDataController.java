package com.thoughtworks.bahmnidhis2integrationservice.controller;

import com.thoughtworks.bahmnidhis2integrationservice.service.impl.TableMetaDataServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/api")
public class TableMetaDataController {

    @Autowired
    private TableMetaDataServiceImpl tableMetaDataService;

    @GetMapping(value = "/getTables")
    @ResponseBody
    public List<String> getAllTableNames() {
        return tableMetaDataService.getAllTableNames();
    }

    @GetMapping(value = "/getColumns")
    @ResponseBody
    public List<String> getAllColumns(@RequestParam("tableName") String tableName) {
        return tableMetaDataService.getAllColumns(tableName);
    }
}
