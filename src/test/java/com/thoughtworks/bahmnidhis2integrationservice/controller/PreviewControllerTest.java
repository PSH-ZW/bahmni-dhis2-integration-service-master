package com.thoughtworks.bahmnidhis2integrationservice.controller;

import com.thoughtworks.bahmnidhis2integrationservice.service.impl.PreviewServiceImpl;
import com.thoughtworks.bahmnidhis2integrationservice.util.DateUtil;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.powermock.core.classloader.annotations.PowerMockIgnore;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.BadSqlGrammarException;

import java.util.*;

import static com.thoughtworks.bahmnidhis2integrationservice.CommonTestHelper.setValuesForMemberFields;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.powermock.api.mockito.PowerMockito.mockStatic;
import static org.powermock.api.mockito.PowerMockito.when;

@RunWith(PowerMockRunner.class)
@PrepareForTest({DateUtil.class})
@PowerMockIgnore("javax.management.*")
public class PreviewControllerTest {
    private PreviewController previewController;

    @Mock
    private PreviewServiceImpl previewService;

    @Mock
    private BadSqlGrammarException badSqlGrammarException;

    @Mock
    private EmptyResultDataAccessException emptyResultDataAccessException;

    @Before
    public void setUp() throws Exception {
        previewController = new PreviewController();
        setValuesForMemberFields(previewController, "previewService", previewService);
        mockStatic(DateUtil.class);
    }

    @Test
    public void shouldGetDeltaData() throws Exception {
        String generatedDate = "2018-10-01 15:09:04";

        String mappingName = "someMapping";
        Map<String, Object> expected = new HashMap();

        Map<String, Object> record1 = new HashMap<>();
        Map<String, Object> record2 = new HashMap<>();

        assignValuesToMap(record1, "NAH0000000001", "PSI-ZIMB-NAH", "2018-09-12", "2018-09-08", "ACTIVE", "2018-09-24");
        record1.put("UIC", "KLNTRA190606M");
        record1.put("self_test_outcome", "Positive");

        assignValuesToMap(record2, "NAH0000000002", "PSI-ZIMB-NAH", "2018-08-12", "2018-08-11", "COMPLETED", "2018-09-24");
        record2.put("UIC", "KLSTTA180773F");
        record2.put("self_test_outcome", "Positive");

        expected.put("result", Arrays.asList(record1, record2));
        expected.put("generatedDate", generatedDate);

        when(previewService.getDeltaData(mappingName)).thenReturn((List<Map<String, Object>>) expected.get("result"));
        when(DateUtil.getUTCDateTimeAsString()).thenReturn(generatedDate);

        Map<String, Object> actual = previewController.getDeltaData(mappingName,null,null);

        assertEquals(actual, expected);

        verify(previewService, times(1)).getDeltaData(mappingName);
    }

    @Test
    public void shouldGetDeltaDataForDateRange() throws Exception {
        String generatedDate = "2018-10-01 15:09:04";

        String mappingName = "someMapping";
        Map<String, Object> expected = new HashMap();

        Map<String, Object> record1 = new HashMap<>();
        Map<String, Object> record2 = new HashMap<>();

        assignValuesToMap(record1, "NAH0000000001", "PSI-ZIMB-NAH", "2018-09-12", "2018-09-08", "ACTIVE", "2018-09-24");
        record1.put("UIC", "KLNTRA190606M");
        record1.put("self_test_outcome", "Positive");

        assignValuesToMap(record2, "NAH0000000002", "PSI-ZIMB-NAH", "2018-08-12", "2018-08-11", "COMPLETED", "2018-09-24");
        record2.put("UIC", "KLSTTA180773F");
        record2.put("self_test_outcome", "Positive");

        expected.put("result", Arrays.asList(record1, record2));
        expected.put("generatedDate", generatedDate);

        Date startDate = new Date();
        Date endDate = new Date();

        when(previewService.getDeltaDataForDateRange(mappingName,startDate,endDate)).thenReturn((List<Map<String, Object>>) expected.get("result"));
        when(DateUtil.getUTCDateTimeAsString()).thenReturn(generatedDate);

        Map<String, Object> actual = previewController.getDeltaData(mappingName,startDate,endDate);

        assertEquals(actual, expected);

        verify(previewService, times(1)).getDeltaDataForDateRange(mappingName,startDate,endDate);
    }

    @Test
    public void shouldReturnAHashMapWithKeyErrorAndShouldSayErrorInPreviewWhenMappingIsNotValid() {
        String mappingName = "invalidMapping";

        when(previewService.getDeltaData(mappingName)).thenThrow(badSqlGrammarException);

        Map<String, Object> actual = previewController.getDeltaData(mappingName,null,null);

        assertTrue(actual.containsKey("error"));
        assertEquals("There is an error in the preview. Please contact Admin.", actual.get("error"));
    }

    @Test
    public void shouldReturnAHashMapWithKeyErrorAndShouldSayNoMappingWhenNoMappingWithTheGivenName() {
        String mappingName = "invalidMapping";

        when(previewService.getDeltaData(mappingName)).thenThrow(emptyResultDataAccessException);

        Map<String, Object> actual = previewController.getDeltaData(mappingName,null,null);

        assertTrue(actual.containsKey("error"));
        assertEquals("No mapping specified with the name invalidMapping", actual.get("error") );
    }

    private void assignValuesToMap(Map<String, Object> map, String patientIdentifier, String orgUnit, String enrollmentDate, String incidentDate, String enrollmentStatus, String program_start_date) {
        map.put("Patient_Identifier", patientIdentifier);
        map.put("OrgUnit", orgUnit);

        map.put("enrollment_date", enrollmentDate);
        map.put("incident_date", incidentDate);
        map.put("status", "ACTIVE");

        map.put("event_date", "2018-09-27");
        map.put("event_status", enrollmentStatus);
        map.put("program_start_date", program_start_date);
    }
}
