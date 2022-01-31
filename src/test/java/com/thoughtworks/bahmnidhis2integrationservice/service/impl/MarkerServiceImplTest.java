package com.thoughtworks.bahmnidhis2integrationservice.service.impl;

import com.thoughtworks.bahmnidhis2integrationservice.dao.impl.MarkerDAOImpl;
import com.thoughtworks.bahmnidhis2integrationservice.model.Mapping;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.powermock.modules.junit4.PowerMockRunner;

import java.util.Arrays;
import java.util.List;

import static com.thoughtworks.bahmnidhis2integrationservice.CommonTestHelper.setValuesForMemberFields;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.powermock.api.mockito.PowerMockito.doNothing;

@RunWith(PowerMockRunner.class)
public class MarkerServiceImplTest {

    private MarkerServiceImpl markerService;

    @Mock
    private MarkerDAOImpl markerDAO;

    @Before
    public void setUp() throws Exception {
        markerService = new MarkerServiceImpl();
        setValuesForMemberFields(markerService, "markerDAO", markerDAO);
    }

    @Test
    public void shouldMakeACallToMarkerDAOToCreateEntries() {
        String oldMappingName = "Tracker";
        String newMappingName = "Tracker Service";

        doNothing().when(markerDAO).createMarkerEntries(oldMappingName, newMappingName);

        markerService.createEntriesForNewService(oldMappingName, newMappingName);

        verify(markerDAO, times(1)).createMarkerEntries(oldMappingName, newMappingName);
    }

    @Test
    public void shouldMakeACallToMarkerDAOToCreateEntriesForImportedMappings() {
        Mapping mapping1 = new Mapping("insert mapping", "", "", "", "", "superman");
        Mapping mapping2 = new Mapping("update mapping", "update mapping", "", "", "", "superman");
        List<Mapping> mappings = Arrays.asList(mapping1,  mapping2);

        doNothing().when(markerDAO).createMarkerEntries(mappings);

        markerService.createMarkerEntries(mappings);

        verify(markerDAO, times(1)).createMarkerEntries(mappings);
    }
}
