package com.thoughtworks.bahmnidhis2integrationservice.controller;

import com.thoughtworks.bahmnidhis2integrationservice.util.SessionUtil;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.powermock.api.mockito.PowerMockito.mockStatic;
import static org.powermock.api.mockito.PowerMockito.when;

@RunWith(PowerMockRunner.class)
@PrepareForTest(SessionUtil.class)
public class HomeControllerTest {

    private HomeController homeController;

    @Before
    public void setUp() throws Exception {
        homeController = new HomeController();
        mockStatic(SessionUtil.class);
    }

    @Test
    public void shouldReturnMapWithUserAndPrivileges() {
        List<String> privileges = Arrays.asList("log", "mapping");
        when(SessionUtil.getUser()).thenReturn("superman");
        when(SessionUtil.getAvailablePrivileges()).thenReturn(privileges);

        Map<String, String> sessionPrivileges = homeController.sessionPrivileges();

        assertEquals("superman", sessionPrivileges.get("user"));
        assertEquals("[log, mapping]", sessionPrivileges.get("privileges"));
    }
}
