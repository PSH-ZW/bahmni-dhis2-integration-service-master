package com.thoughtworks.bahmnidhis2integrationservice.service.impl;

import com.thoughtworks.bahmnidhis2integrationservice.dao.impl.PreviewDAOImpl;
import com.thoughtworks.bahmnidhis2integrationservice.service.PreviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.sql.SQLException;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Component
public class PreviewServiceImpl implements PreviewService {
    @Autowired
    PreviewDAOImpl previewDAO;

    @Override
    public List<Map<String, Object>> getDeltaData(String mappingName){
        return previewDAO.getDeltaData(mappingName);
    }

    @Override
    public List<Map<String, Object>> getDeltaDataForDateRange(String mappingName, Date startDate, Date endDate){
        return previewDAO.getDeltaDataForDateRange(mappingName, startDate, endDate);
    }
}
