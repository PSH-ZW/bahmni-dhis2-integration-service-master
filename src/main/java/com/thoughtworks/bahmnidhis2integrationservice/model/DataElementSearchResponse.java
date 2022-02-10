package com.thoughtworks.bahmnidhis2integrationservice.model;

import java.util.List;
import java.util.Map;

public class DataElementSearchResponse {
    List<Map<String, String>> dataElements;

    public List<Map<String, String>> getDataElements() {
        return dataElements;
    }

    public void setDataElements(List<Map<String, String>> dataElements) {
        this.dataElements = dataElements;
    }
}
