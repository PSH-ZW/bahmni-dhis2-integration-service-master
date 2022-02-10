package com.thoughtworks.bahmnidhis2integrationservice.repository;

import org.junit.Before;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.powermock.core.classloader.annotations.PowerMockIgnore;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.slf4j.Logger;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

import static com.thoughtworks.bahmnidhis2integrationservice.CommonTestHelper.setValuesForMemberFields;
import static org.powermock.api.mockito.PowerMockito.whenNew;

@RunWith(PowerMockRunner.class)
@PrepareForTest({SyncRepository.class})
@PowerMockIgnore("javax.management.*")
public class SyncRepositoryTest {
    private SyncRepository syncRepository;
    private String body;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private Logger logger;

    @Mock
    private HttpHeaders httpHeaders;

    @Mock
    private HttpEntity httpEntity;

    @Before
    public void setUp() throws Exception {
        body = "{" +
                "service: \"someMapping\"," +
                "user: \"superman\"," +
                "comment: \"This is a comment\" " +
                "}";

        syncRepository = new SyncRepository();

        setValuesForMemberFields(syncRepository,"logger", logger);
        whenNew(RestTemplate.class).withNoArguments().thenReturn(restTemplate);
        whenNew(HttpHeaders.class).withNoArguments().thenReturn(httpHeaders);
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        whenNew(HttpEntity.class).withArguments(body, httpHeaders).thenReturn(httpEntity);
    }




}
