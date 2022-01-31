package com.thoughtworks.bahmnidhis2integrationservice.config;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.powermock.modules.junit4.PowerMockRunner;
import org.springframework.core.env.Environment;

import static com.thoughtworks.bahmnidhis2integrationservice.CommonTestHelper.setValuesForMemberFields;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

@RunWith(PowerMockRunner.class)
public class AppPropertiesTest {

    @Mock
    private Environment env;

    private AppProperties appProperties;

    @Before
    public void setUp() throws Exception {
        appProperties = new AppProperties();

        setValuesForMemberFields(appProperties, "env", env);
    }

    @Test
    public void shouldReturnRootUrl() {
        String rootUrl = "localhost:8000";
        when(env.getProperty("openmrs.service.rootUrl")).thenReturn(rootUrl);

        assertEquals(rootUrl, appProperties.getOpenmrsRootUrl());
    }
}
