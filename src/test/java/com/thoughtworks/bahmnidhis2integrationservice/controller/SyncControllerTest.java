package com.thoughtworks.bahmnidhis2integrationservice.controller;

import com.thoughtworks.bahmnidhis2integrationservice.service.impl.SyncServiceImpl;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.powermock.modules.junit4.PowerMockRunner;

import static com.thoughtworks.bahmnidhis2integrationservice.CommonTestHelper.setValuesForMemberFields;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.powermock.api.mockito.PowerMockito.doNothing;

@RunWith(PowerMockRunner.class)
public class SyncControllerTest {
    private SyncController syncController;

    @Mock
    private SyncServiceImpl syncService;

    @Before
    public void setUp() throws Exception {
        syncController = new SyncController();
        setValuesForMemberFields(syncController, "syncService", syncService);
    }

    @Test
    public void shouldCallSyncMethodInSyncService() throws Exception {
        String body = "{}";
        doNothing().when(syncService).sync(body);
        syncController.sync(body);
        verify(syncService, times(1)).sync(body);
    }
}
