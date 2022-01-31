package com.thoughtworks.bahmnidhis2integrationservice.service.impl;

import com.thoughtworks.bahmnidhis2integrationservice.dao.impl.PreviewDAOImpl;
import com.thoughtworks.bahmnidhis2integrationservice.service.PreviewService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.powermock.modules.junit4.PowerMockRunner;
import org.springframework.jdbc.BadSqlGrammarException;

import java.sql.SQLException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.thoughtworks.bahmnidhis2integrationservice.CommonTestHelper.setValuesForMemberFields;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.powermock.api.mockito.PowerMockito.when;

@RunWith(PowerMockRunner.class)
public class PreviewServiceImplTest {
    private PreviewService previewService;

    @Mock
    private PreviewDAOImpl previewDAO;

    @Mock
    private BadSqlGrammarException badSqlGrammarException;

    @Before
    public void setUp() throws Exception {
        previewService = new PreviewServiceImpl();
        setValuesForMemberFields(previewService, "previewDAO", previewDAO);
    }

    @Test
    public void shouldGetDeltaData() {
        String mappingName = "someMapping";
        List<Map<String, Object>> expected;

        Map<String, Object> record1 = new HashMap<>();
        Map<String, Object> record2 = new HashMap<>();

        assignValuesToMap(record1, "NAH0000000001", "PSI-ZIMB-NAH", "2018-09-12", "2018-09-08", "ACTIVE", "2018-09-24");
        record1.put("UIC", "KLNTRA190606M");
        record1.put("self_test_outcome", "Positive");

        assignValuesToMap(record2, "NAH0000000002", "PSI-ZIMB-NAH", "2018-08-12", "2018-08-11", "COMPLETED", "2018-09-24");
        record2.put("UIC", "KLSTTA180773F");
        record2.put("self_test_outcome", "Positive");

        expected = Arrays.asList(record1, record2);

        when(previewDAO.getDeltaData(mappingName)).thenReturn(expected);

        List<Map<String, Object>> actual = previewService.getDeltaData(mappingName);

        assertEquals(actual, expected);

        verify(previewDAO, times(1)).getDeltaData(mappingName);
    }

    @Test(expected = BadSqlGrammarException.class)
    public void shouldThrowErrorWhenTheMappingIsNotValid() throws BadSqlGrammarException {
        String mappingName = "invalidMapping";

        when(previewDAO.getDeltaData(mappingName)).thenThrow(badSqlGrammarException);

        previewService.getDeltaData(mappingName);
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
