package com.thoughtworks.bahmnidhis2integrationservice.repository;

import com.thoughtworks.bahmnidhis2integrationservice.model.SearchResponse;
import org.apache.tomcat.util.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.Charset;
import java.util.List;
import java.util.Map;

@Repository
public class SyncRepository {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    private static final String PROGRAM_DETAILS_URI = "/api/29/metadata?" +
            "filter=id:eq:%s&programs:fields=programStages[displayName,id]";
    private static final String BASE_SEARCH_URI = "/api/29/%s?" +
            "filter=name:ne:default&fields=displayName,id&order=displayName:ASC&pageSize=20&filter=identifiable:token:%s";

    private static final String DATA_ELEMENTS = "dataElements";
    private static final String TRACKED_ENTITY_ATTRIBUTES = "trackedEntityAttributes";

    @Value("${dhis2.url}")
    private String dhis2Url;

    @Value("${dhis2.user}")
    private String dhisUser;

    @Value("${dhis2.program-id}")
    private String dhisProgramId;

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
        //Using common SearchResponse class since we are only searching for two types of objects. If we need to add
        //more search types, better to remove SearchResponse class and consider the result as a Map<String, Object>
        // and get using the searchType.
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

    public List<Map<String, String>> getProgramStages() {
        ResponseEntity<Map<String, Object>> responseEntity;
        try {
            responseEntity = restTemplate
                    .exchange(dhis2Url + String.format(PROGRAM_DETAILS_URI, dhisProgramId), HttpMethod.GET,
                            new HttpEntity<>(getHttpHeaders()), new ParameterizedTypeReference<Map<String, Object>>() {});
            Map<String, Object> programDetails = responseEntity.getBody();
            if(programDetails != null) {
                List<Map<String, Object>> programs = (List<Map<String, Object>>) programDetails.get("programs");
                if(!CollectionUtils.isEmpty(programs)) {
                    Map<String, Object> program = programs.get(0);
                    List<Map<String, String>> programStages = (List<Map<String, String>>) program.get("programStages");
                    return programStages;
                }
            }
        } catch (Exception e) {
            logger.error("Could not search Data Elements from DHIS2. " + e);
        }
        return null;
    }
}
