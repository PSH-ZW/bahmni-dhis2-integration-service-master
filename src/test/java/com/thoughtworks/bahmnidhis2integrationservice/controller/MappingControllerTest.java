package com.thoughtworks.bahmnidhis2integrationservice.controller;

import com.thoughtworks.bahmnidhis2integrationservice.exception.NoMappingFoundException;
import com.thoughtworks.bahmnidhis2integrationservice.model.Mapping;
import com.thoughtworks.bahmnidhis2integrationservice.model.MappingDetails;
import com.thoughtworks.bahmnidhis2integrationservice.service.impl.LoggerServiceImpl;
import com.thoughtworks.bahmnidhis2integrationservice.service.impl.MappingServiceImpl;
import com.thoughtworks.bahmnidhis2integrationservice.service.impl.MarkerServiceImpl;
import lombok.SneakyThrows;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.powermock.modules.junit4.PowerMockRunner;

import java.util.*;

import static com.thoughtworks.bahmnidhis2integrationservice.CommonTestHelper.setValuesForMemberFields;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.powermock.api.mockito.PowerMockito.doNothing;
import static org.powermock.api.mockito.PowerMockito.when;

@RunWith(PowerMockRunner.class)
public class MappingControllerTest {

    private MappingController mappingController;

    @Mock
    private MappingServiceImpl mappingService;

    @Mock
    private MarkerServiceImpl markerService;

    @Mock
    private LoggerServiceImpl logService;

    private String mappingName = "patient_details";
    private String lookupTable = "patient";
    private String mappingJson = "{'patient_id': 'Asj8X', 'patient_name': 'jghTk9'}";
    private String currentMapping = "pat_details";
    private String config = "{\"searchable\": [\"patient_id\", \"allergy_status\"]}";
    private String user = "user";

    private Map<String, String> params = new HashMap<>();

    @Before
    public void setUp() throws Exception {
        mappingController = new MappingController();
        setValuesForMemberFields(mappingController, "mappingService", mappingService);
        setValuesForMemberFields(mappingController, "markerService", markerService);
        setValuesForMemberFields(mappingController, "logService", logService);

        params.put("mappingName", mappingName);
        params.put("lookupTable", lookupTable);
        params.put("mappingJson", mappingJson);
        params.put("currentMapping", currentMapping);
        params.put("config", config);
        params.put("user", user);
    }

    @Test
    public void shouldSaveMappings() throws Exception {
        String expected = "Successfully Added Mapping";

        when(mappingService.saveMapping(mappingName, lookupTable, mappingJson, config, currentMapping, user)).thenReturn(expected);

        doNothing().when(markerService).createEntriesForNewService(currentMapping, mappingName);

        Map<String, String> actual = mappingController.saveMappings(params);

        verify(mappingService, times(1))
                .saveMapping(mappingName, lookupTable, mappingJson, config, currentMapping, user);
        verify(markerService, times(1)).createEntriesForNewService(currentMapping, mappingName);

        assertEquals(expected, actual.get("data"));
    }

    @Test
    public void shouldThrowErrorOnFail() throws Exception {
        String expected = "Could not able to add Mapping";

        when(mappingService.saveMapping(mappingName, lookupTable, mappingJson, config, currentMapping, user))
                .thenThrow(new Exception(expected));

        try {
            mappingController.saveMappings(params);
        } catch (Exception e) {
            verify(mappingService, times(1))
                    .saveMapping(mappingName, lookupTable, mappingJson, config, currentMapping, user);
            assertEquals(expected, e.getMessage());
        }
    }

    @Test
    public void shouldReturnAllMappingNames() {
        List<String> expected = Arrays.asList("HTS Service", "TB Service");
        when(mappingService.getMappingNames()).thenReturn(expected);

        List<String> allMappings = mappingController.getAllMappingNames();

        assertEquals(allMappings, expected);
    }

    @Test
    public void shouldReturnAllMappingsWithSyncInformation() {
        Map<String, MappingDetails> expected = new HashMap<>();
        expected.put("HTS Service", new MappingDetails("2018-10-03 11:21:32.000000", "success",false,null,null));
        expected.put("TB Service", new MappingDetails("2018-10-04 11:21:32.000000", "success",false,null,null));

        List<String> mappingNames = Arrays.asList("HTS Service", "TB Service");
        when(mappingService.getMappingNames()).thenReturn(mappingNames);
        when(logService.getSyncDateForService("HTS Service")).thenReturn("2018-10-03 11:21:32.000000");
        when(logService.getLatestSyncStatus("HTS Service")).thenReturn("success");
        when(logService.getSyncDateForService("TB Service")).thenReturn("2018-10-04 11:21:32.000000");
        when(logService.getLatestSyncStatus("TB Service")).thenReturn("success");

        Map<String, MappingDetails> allMappings = mappingController.getAllMappingsSyncInfo();

        assertEquals(allMappings, expected);
    }

    @Test
    public void shouldReturnExistingMappingName() throws NoMappingFoundException {
        Map<String, Object> HTSMapping = new HashMap<>();

        HTSMapping.put("mapping_name", "HTS Service");
        HTSMapping.put("lookup_table", "{\"instance\" : \"patient\"}");
        HTSMapping.put("mapping_json", "{\"instance\" : {\"patient_id\": \"Asj8X\", \"patient_name\": \"jghTk9\"}}");

        when(mappingService.getMapping("HTS Service")).thenReturn(HTSMapping);

        assertEquals(HTSMapping, mappingController.getMapping("HTS Service"));

        verify(mappingService, times(1)).getMapping("HTS Service");
    }

    @Test
    public void shouldThrowEmptyResultDataAccessExceptionWhenThereIsNoMapping() throws NoMappingFoundException {
        String mappingName = "someMapping";

        when(
                mappingService.getMapping(mappingName)
        ).thenThrow(new NoMappingFoundException(mappingName));

        try {
            mappingController.getMapping(mappingName);
        } catch (NoMappingFoundException e) {
            assertEquals(e.getMessage(), "Mapping " + mappingName + " not found.");
        }
    }

    @Test
    public void shouldImportAllMappingsSuccessfully() throws Exception {
        String expected = "Successfully Imported Mapping(s)";
        String lookupTable = "{" +
                    "\"instance\":\"hts_instance_table\"," +
                    "\"enrollments\":\"hts_program_enrollment_table\"," +
                    "\"event\":\"hts_program_events_table\"" +
                "}";
        String mappingJson = "{" +
                    "\"instance\":" +
                        "{" +
                            "\"Patient_Identifier\":\"\"," +
                            "\"UIC\":\"rOb34aQLSyC\"" +
                        "}," +
                    "\"event\":" +
                        "{" +
                            "\"self_testing_outcome\":\"gwatO1kb3Fy\"," +
                            "\"client_received\":\"gXNu7zJBTDN\"" +
                        "}" +
                "}";
        String config = "{" +
                    "\"searchable\" : [\"UIC\"]," +
                    "\"comparable\" : [\"patient_id\"]" +
                "}";
        String mapping = "{" +
                    "\"mapping_name\":\"test2\"," +
                    "\"lookup_table\":" +
                        "\"{" +
                            "\\\"instance\\\":\\\"hts_instance_table\\\"," +
                            "\\\"enrollments\\\":\\\"hts_program_enrollment_table\\\"," +
                            "\\\"event\\\":\\\"hts_program_events_table\\\"" +
                        "}\"," +
                    "\"mapping_json\":" +
                        "\"{" +
                            "\\\"instance\\\":" +
                                "{" +
                                    "\\\"Patient_Identifier\\\":\\\"\\\"," +
                                    "\\\"UIC\\\":\\\"rOb34aQLSyC\\\"" +
                                "}," +
                            "\\\"event\\\":" +
                                "{" +
                                    "\\\"self_testing_outcome\\\":\\\"gwatO1kb3Fy\\\"," +
                                    "\\\"client_received\\\":\\\"gXNu7zJBTDN\\\"" +
                                "}" +
                        "}\"," +
                    "\"config\":" +
                        "\"{" +
                            "\\\"searchable\\\" : [\\\"UIC\\\"]," +
                            "\\\"comparable\\\" : [\\\"patient_id\\\"]" +
                        "}\"," +
                    "\"user\":\"superman\"" +
                "}";

        List<Object> mappings = Collections.singletonList(mapping);

        Mapping mappingObj = new Mapping("test2", null, lookupTable, mappingJson, config, "superman");
        List<Mapping> mappingsObj = Collections.singletonList(mappingObj);

        when(mappingService.saveMapping(mappingsObj)).thenReturn(expected);
        doNothing().when(markerService).createMarkerEntries(mappingsObj);

        Map<String, String> actual = mappingController.saveMappings(mappings);

        verify(mappingService, times(1)).saveMapping(mappingsObj);
        verify(markerService, times(1)).createMarkerEntries(mappingsObj);

        assertEquals(expected, actual.get("data"));
    }

    @Test
    public void shouldThrowErrorWhenImportFails() throws Exception {
        String expected = "Could not able to add Mapping";
        String lookupTable = "{" +
                    "\"instance\":\"hts_instance_table\"," +
                    "\"enrollments\":\"hts_program_enrollment_table\"," +
                    "\"event\":\"hts_program_events_table\"" +
                "}";
        String mappingJson = "{" +
                    "\"instance\":" +
                        "{" +
                            "\"Patient_Identifier\":\"\"," +
                            "\"UIC\":\"rOb34aQLSyC\"" +
                        "}," +
                    "\"event\":" +
                        "{" +
                            "\"self_testing_outcome\":\"gwatO1kb3Fy\"," +
                            "\"client_received\":\"gXNu7zJBTDN\"" +
                        "}" +
                "}";

        String mapping = "{" +
                    "\"mapping_name\":\"test2\"," +
                    "\"lookup_table\":" +
                        "\"{" +
                            "\\\"instance\\\":\\\"hts_instance_table\\\"," +
                            "\\\"enrollments\\\":\\\"hts_program_enrollment_table\\\"," +
                            "\\\"event\\\":\\\"hts_program_events_table\\\"" +
                        "}\"," +
                    "\"mapping_json\":" +
                        "\"{" +
                            "\\\"instance\\\":" +
                                "{" +
                                    "\\\"Patient_Identifier\\\":\\\"\\\"," +
                                    "\\\"UIC\\\":\\\"rOb34aQLSyC\\\"" +
                                "}," +
                            "\\\"event\\\":" +
                                "{" +
                                    "\\\"self_testing_outcome\\\":\\\"gwatO1kb3Fy\\\"," +
                                    "\\\"client_received\\\":\\\"gXNu7zJBTDN\\\"" +
                            "}" +
                        "}\"," +
                    "\"user\":\"superman\"" +
                "}";

        String config = "{" +
                "\"searchable\" : [\"UIC\"]," +
                "\"comparable\" : [\"patient_id\"]" +
                "}";

        List<Object> mappings = Collections.singletonList(mapping);

        Mapping mappingObj = new Mapping("test2", "", lookupTable, mappingJson, config, "superman");
        List<Mapping> mappingsObj = Collections.singletonList(mappingObj);

        when(mappingService.saveMapping(mappingsObj))
                .thenThrow(new Exception(expected));

        try {
            mappingController.saveMappings(mappings);
        } catch (Exception e) {
            verify(mappingService, times(1)).saveMapping(mappingsObj);
            assertEquals(expected, e.getMessage());
        }
    }

    @Test
    public void shouldReturnAllTheDetailedMappings() throws NoMappingFoundException {
        Map<String, Object> htsMapping = new HashMap<>();
        htsMapping.put("mappingName", "HTS Service");
        htsMapping.put("lookupTable", "{\"instance\" : \"patient\"}");
        htsMapping.put("mappingJson", "{\"patient_id\": \"Asj8X\", \"patient_name\": \"jghTk9\"}");

        Map<String, Object> tbMapping = new HashMap<>();
        tbMapping.put("mappingName", "TB Service");
        tbMapping.put("lookupTable", "{\"instance\" : \"patient\"}");
        tbMapping.put("mappingJson", "{\"patient_id\": \"Asj8X\", \"patient_name\": \"jghTk9\"}");

        List<Map<String, Object>>  expected = new ArrayList<>();
        expected.add(htsMapping);
        expected.add(tbMapping);

        when(mappingService.getAllMappings()).thenReturn(expected);

        assertEquals(expected, mappingController.getAllMappings());

        verify(mappingService, times(1)).getAllMappings();
    }

    @Test
    @SneakyThrows
    public void shouldThrowEmptyResultDataAccessExceptionWhenThereAreNoMapping() throws NoMappingFoundException {
        when(mappingService.getAllMappings()).thenThrow(new NoMappingFoundException(""));

        try {
            mappingController.getAllMappings();
        } catch (NoMappingFoundException e) {
            assertEquals("Mapping  not found.", e.getMessage());
        }
    }

}
