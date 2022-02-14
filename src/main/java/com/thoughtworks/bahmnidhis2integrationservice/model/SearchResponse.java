package com.thoughtworks.bahmnidhis2integrationservice.model;

import java.util.List;
import java.util.Map;

public class SearchResponse {
    //Generic class for using as a search result. Both these fields will not be present together at the same time.
    List<Map<String, String>> dataElements;
    List<Map<String, String>> trackedEntityAttributes;

    public List<Map<String, String>> getDataElements() {
        return dataElements;
    }

    public void setDataElements(List<Map<String, String>> dataElements) {
        this.dataElements = dataElements;
    }

    public List<Map<String, String>> getTrackedEntityAttributes() {
        return trackedEntityAttributes;
    }

    public void setTrackedEntityAttributes(List<Map<String, String>> trackedEntityAttributes) {
        this.trackedEntityAttributes = trackedEntityAttributes;
    }
}
