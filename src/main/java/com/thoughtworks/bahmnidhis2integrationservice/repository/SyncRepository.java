package com.thoughtworks.bahmnidhis2integrationservice.repository;

import com.thoughtworks.bahmnidhis2integrationservice.model.SearchResponse;
import org.apache.tomcat.util.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.Charset;
import java.util.List;
import java.util.Map;

@Repository
public class SyncRepository {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    private static final String BASE_SEARCH_URI = "/api/29/%s?" +
            "filter=name:ne:default&fields=displayName,id&order=displayName:ASC&pageSize=20&filter=identifiable:token:%s";
    private static final String DATA_ELEMENTS = "dataElements";
    private static final String TRACKED_ENTITY_ATTRIBUTES = "trackedEntityAttributes";

    @Value("${dhis2.url}")
    private String dhis2Url;

    @Value("${dhis2.user}")
    private String dhisUser;

    @Value("${dhis2.password}")
    private String dhisPassword;

    @Autowired
    private RestTemplate restTemplate;

    public List<Map<String, String>> searchDataElements(String searchString) {
        SearchResponse response = getSearchResult(DATA_ELEMENTS, searchString);
        return response != null ? response.getDataElements() : null;
    }

    public List<Map<String, String>> searchTrackedEntityAttributes(String searchString) {
        SearchResponse response = getSearchResult(TRACKED_ENTITY_ATTRIBUTES, searchString);
        return response != null ? response.getTrackedEntityAttributes() : null;
    }

    private SearchResponse getSearchResult(String searchType, String searchString) {
        ResponseEntity<SearchResponse> responseEntity;
        try {
            responseEntity = restTemplate
                    .exchange(dhis2Url + String.format(BASE_SEARCH_URI, searchType, searchString), HttpMethod.GET,
                            new HttpEntity<>(getHttpHeaders()), SearchResponse.class);
            SearchResponse dataElementSearchResponse = responseEntity.getBody();
            if(dataElementSearchResponse != null) {
                return responseEntity.getBody();
            }
        } catch (Exception e) {
            logger.error("Could not search Data Elements from DHIS2. " + e);
        }
        return null;
    }

    private HttpHeaders getHttpHeaders() {
        String auth = dhisUser + ":" + dhisPassword;
        byte[] encodedAuth = Base64.encodeBase64(auth.getBytes(Charset.forName("US-ASCII")));
        String authHeader = "Basic " + new String(encodedAuth);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        httpHeaders.set("Authorization", authHeader);

        return httpHeaders;
    }

}
