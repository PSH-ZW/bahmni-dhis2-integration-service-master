package com.thoughtworks.bahmnidhis2integrationservice.repository;

import com.thoughtworks.bahmnidhis2integrationservice.model.DataElementSearchResponse;
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

    private static final String SEARCH_URI = "/api/29/dataElements?filter=name:ne:default&fields=displayName,id&" +
            "order=displayName:ASC&pageSize=20&filter=identifiable:token:%s";

    @Value("${dhis2.url}")
    private String dhis2Url;

    @Value("${dhis2.user}")
    private String dhisUser;

    @Value("${dhis2.password}")
    private String dhisPassword;

    @Autowired
    private RestTemplate restTemplate;

    public List<Map<String, String>> searchDataElements(String searchString) {
        ResponseEntity<DataElementSearchResponse> responseEntity = null;
        try {
            StringBuilder URI = new StringBuilder(dhis2Url);
            URI.append(String.format(SEARCH_URI, searchString));
            responseEntity = restTemplate
                    .exchange(URI.toString(), HttpMethod.GET,
                            new HttpEntity<>(getHttpHeaders()), DataElementSearchResponse.class);
            DataElementSearchResponse dataElementSearchResponse = responseEntity.getBody();
            if(dataElementSearchResponse != null) {
                return dataElementSearchResponse.getDataElements();
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
