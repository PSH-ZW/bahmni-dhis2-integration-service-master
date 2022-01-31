package com.thoughtworks.bahmnidhis2integrationservice.controller;

import com.thoughtworks.bahmnidhis2integrationservice.service.impl.PreviewServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static com.thoughtworks.bahmnidhis2integrationservice.util.DateUtil.getUTCDateTimeAsString;

@Controller
@RequestMapping("/api")
public class PreviewController {
    @Autowired
    private PreviewServiceImpl previewService;

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @GetMapping(value = "/getDeltaData")
    @ResponseBody
    public Map<String, Object> getDeltaData(String mappingName,@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) @RequestParam
            (required = false) Date startDate, @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) @RequestParam
            (required = false) Date endDate) {
        Map<String, Object> resultObj = new HashMap<>();

        try {
            if(startDate == null && endDate == null)
                resultObj.put("result", previewService.getDeltaData(mappingName));
            else
                resultObj.put("result", previewService.getDeltaDataForDateRange(mappingName,startDate,endDate));
        } catch (BadSqlGrammarException bsge) {
            resultObj.put("error", "There is an error in the preview. Please contact Admin.");
            logger.error(bsge.getMessage());
        }catch (EmptyResultDataAccessException erdae){
            resultObj.put("error", "No mapping specified with the name "+ mappingName);
        }
        resultObj.put("generatedDate", getUTCDateTimeAsString());

        return resultObj;
    }
}
