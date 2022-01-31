package com.thoughtworks.bahmnidhis2integrationservice.service.impl;

import com.thoughtworks.bahmnidhis2integrationservice.repository.SyncRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.powermock.modules.junit4.PowerMockRunner;

import static com.thoughtworks.bahmnidhis2integrationservice.CommonTestHelper.setValuesForMemberFields;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;

@RunWith(PowerMockRunner.class)
public class SyncServiceImplTest {
    SyncServiceImpl syncService;

    @Mock
    private SyncRepository syncRepository;

    @Before
    public void setUp() throws Exception {
        syncService = new SyncServiceImpl();
        setValuesForMemberFields(syncService, "syncRepository", syncRepository);
    }

    @Test
    public void shouldCallSyncMethodInSyncRepository() throws Exception {
        String body = "{" +
                "service: \"someMapping\"," +
                "user: \"superman\"," +
                "comment: \"This is a comment\" " +
                "}";
        doNothing().when(syncRepository).sync(body);
        syncService.sync(body);
        verify(syncRepository).sync(body);
    }
}
