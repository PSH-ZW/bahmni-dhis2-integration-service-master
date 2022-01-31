package com.thoughtworks.bahmnidhis2integrationservice.repository;

import com.google.gson.Gson;
import com.thoughtworks.bahmnidhis2integrationservice.model.ServerErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

@Repository
public class SyncRepository {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    public void sync(String body) throws Exception {
        try {
            new RestTemplate().exchange("http://localhost/sync/pushData",
                    HttpMethod.PUT,
                    new HttpEntity<>(body, getHeaders()),
                    Object.class
            );
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            ResponseEntity<ServerErrorResponse> responseEntity = new ResponseEntity<>(
                    new Gson().fromJson(e.getResponseBodyAsString(), ServerErrorResponse.class),
                    e.getStatusCode());
            ServerErrorResponse serverErrorResponse = responseEntity.getBody();
            String message = serverErrorResponse != null ? serverErrorResponse.getMessage() : "";
            logger.error(message);
            throw new Exception(message);
        }
    }

    private HttpHeaders getHeaders() {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        return httpHeaders;
    }
}
