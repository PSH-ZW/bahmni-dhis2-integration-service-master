package com.thoughtworks.bahmnidhis2integrationservice.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

@Configuration
@PropertySource("classpath:application.properties")
public class AppProperties {

    @Autowired
    private Environment env;

    public String getOpenmrsRootUrl() {
        return env.getProperty("openmrs.service.rootUrl");
    }
}
