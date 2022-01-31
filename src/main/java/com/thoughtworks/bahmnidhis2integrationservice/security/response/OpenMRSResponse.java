package com.thoughtworks.bahmnidhis2integrationservice.security.response;

import lombok.Data;

@Data
public class OpenMRSResponse {
    private String sessionId;
    private boolean authenticated;
    private User user = new User();
    private String locale;
}
