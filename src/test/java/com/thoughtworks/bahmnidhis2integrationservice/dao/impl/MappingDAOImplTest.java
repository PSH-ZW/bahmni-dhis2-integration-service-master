package com.thoughtworks.bahmnidhis2integrationservice.dao.impl;

import com.thoughtworks.bahmnidhis2integrationservice.exception.NoMappingFoundException;
import com.thoughtworks.bahmnidhis2integrationservice.model.Mapping;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;

import java.text.SimpleDateFormat;
import java.util.*;

import static com.thoughtworks.bahmnidhis2integrationservice.CommonTestHelper.setValuesForMemberFields;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.powermock.api.mockito.PowerMockito.*;

@RunWith(PowerMockRunner.class)
@PrepareForTest({TimeZone.class, MappingDAOImpl.class})
public class MappingDAOImplTest {

    private MappingDAOImpl mappingDAO;

    @Mock
    private JdbcTemplate jdbcTemplate;

    private String mappingName = "patient_details";
    private String lookupTable = "patient";
    private String user = "superman";
    private String time = "28-10-2018 02:13:10";
    private String mappingJson = "{\"patient_id\": \"Asj8X\", \"patient_name\": \"jghTk9\"}";
    private String config = "{\"searchable\": [\"patient_id\", \"allergy_status\"]}";
    private String sql = String.format("INSERT INTO mapping (mapping_name, lookup_table, mapping_json, config, created_by, date_created) " +
            "VALUES ('%s', '%s', '%s', '%s', '%s', '%s');", mappingName, lookupTable, mappingJson, config, user, time);

    private String currentMapping = "";

    @Before
    public void setUp() throws Exception {
        mappingDAO = new MappingDAOImpl();
        Date dateMock = mock(Date.class);
        whenNew(Date.class).withNoArguments().thenReturn(dateMock);
        SimpleDateFormat simpleDateFormat = mock(SimpleDateFormat.class);
        whenNew(SimpleDateFormat.class).withArguments("yyyy-MM-dd HH:mm:ss").thenReturn(simpleDateFormat);
        TimeZone timeZone = mock(TimeZone.class);
        mockStatic(TimeZone.class);
        when(TimeZone.getTimeZone("UTC")).thenReturn(timeZone);
        doNothing().when(simpleDateFormat).setTimeZone(timeZone);
        when(simpleDateFormat.format(dateMock)).thenReturn(time);
        setValuesForMemberFields(mappingDAO, "jdbcTemplate", jdbcTemplate);
    }

    @Test
    public void shouldReturnSuccessfulMessageOnSuccessfulInsertion() throws Exception {
        when(jdbcTemplate.update(sql)).thenReturn(1);

        String result = mappingDAO.saveMapping(mappingName, mappingJson, config, currentMapping, user);

        verify(jdbcTemplate, times(1)).update(sql);
        assertEquals("Successfully Saved Mapping", result);
    }

    @Test
    public void shouldUpdateTableWhenCurrentMappingHasValue() throws Exception {
        currentMapping = "pro_details";
        sql = String.format("UPDATE mapping " +
                "SET mapping_name='%s', mapping_json='%s', config='%s', modified_by='%s', date_modified='%s' " +
                "WHERE mapping_name='%s';", mappingName, mappingJson, config, user, time, currentMapping);
        when(jdbcTemplate.update(sql)).thenReturn(1);

        String result = mappingDAO.saveMapping(mappingName, mappingJson, config, currentMapping, user);

        verify(jdbcTemplate, times(1)).update(sql);
        assertEquals("Successfully Saved Mapping", result);
    }

    @Test
    public void shouldThrowErrorOnFail() throws Exception {
        when(jdbcTemplate.update(sql)).thenReturn(0);

        try {
            mappingDAO.saveMapping(mappingName, mappingJson, config, currentMapping, user);
        } catch(Exception e) {
            verify(jdbcTemplate, times(1)).update(sql);
            assertEquals("Could not add Mapping", e.getMessage());
        }
    }

    @Test
    public void shouldGetExistingMappings() {
        String sql = "SELECT mapping_name FROM mapping";
        Map<String, Object> mapping1 = new HashMap<>();
        Map<String, Object> mapping2 = new HashMap<>();

        mapping1.put("mapping_name", "HTS");
        mapping2.put("mapping_name", "TB");

        List<String> expected = Arrays.asList("HTS","TB");
        List<Map<String, Object>> result = Arrays.asList(mapping1,mapping2);

        when(jdbcTemplate.queryForList(sql)).thenReturn(result);

        assertEquals(expected, mappingDAO.getMappingNames());

        verify(jdbcTemplate, times(1)).queryForList(sql);
    }

    @Test
    public void shouldGetExistingMapping() throws NoMappingFoundException {
        String sql = "SELECT program_name, mapping_json, config FROM mapping WHERE program_name= 'HTS Service'";
        Map<String, Object> HTSMapping = new HashMap<>();

        HTSMapping.put("mapping_name","HTS Service");
        HTSMapping.put("mapping_json","{\"instance\" : {\"patient_id\": \"Asj8X\", \"patient_name\": \"jghTk9\"}}");
        HTSMapping.put("searchable","[\"patient_id\", \"allergy_status\"]");

        when(jdbcTemplate.queryForMap(sql)).thenReturn(HTSMapping);

        assertEquals(HTSMapping, mappingDAO.getMapping("HTS Service"));

        verify(jdbcTemplate, times(1)).queryForMap(sql);
    }

    @Test
    public void shouldThrowExceptionWhenMappingIsNotExists() throws NoMappingFoundException {
        String sql = "SELECT mapping_name, mapping_json, config FROM mapping WHERE mapping_name= 'HTS Service'";

        when(jdbcTemplate.queryForMap(sql)).thenThrow(new EmptyResultDataAccessException(0));

        try {
            mappingDAO.getMapping("HTS Service");
        } catch (NoMappingFoundException e) {
            verify(jdbcTemplate, times(1)).queryForMap(sql);
            assertEquals("Mapping HTS Service not found.", e.getMessage());
        }
    }

    @Test
    public void shouldInsertTheMappingWhichDoesNotHaveCurrentMappingNameAndShouldUpdateMappingWhichHasCurrentMapping() throws Exception {
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

        Mapping mapping1 = new Mapping("insert mapping", "",  mappingJson, config, "superman");
        Mapping mapping2 = new Mapping("update mapping", "update mapping", mappingJson, config, "superman");

        List<Mapping> mappings = Arrays.asList(mapping1,  mapping2);
        String sql1 = String.format("INSERT INTO mapping (mapping_name, lookup_table, mapping_json, config, created_by, date_created) " +
                "VALUES ('insert mapping', '%s', '%s', '%s', 'superman', '%s');", lookupTable, mappingJson, config, time);

        String sql2 = String.format("UPDATE mapping " +
                "SET mapping_name='update mapping', lookup_table='%s', mapping_json='%s', config='%s', modified_by='superman', date_modified='%s' " +
                "WHERE mapping_name='update mapping';", lookupTable, mappingJson, config, time);

        when(jdbcTemplate.update(sql1 + sql2)).thenReturn(1);

        String result = mappingDAO.saveMapping(mappings);

        verify(jdbcTemplate, times(1)).update(sql1 + sql2);
        assertEquals("Successfully Imported All Mappings", result);
    }

    @Test
    public void shouldThrowErrorWhenImportOfMappingsGotFailed() throws Exception {
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

        Mapping mapping1 = new Mapping("insert mapping", "", mappingJson, config , "superman");

        List<Mapping> mappings = Collections.singletonList(mapping1);
        String sql = String.format("INSERT INTO mapping (mapping_name, mapping_json, config, created_by, date_created) " +
                "VALUES ('insert mapping', '%s', '%s', 'superman', '%s');", mappingJson, config, time);

        when(jdbcTemplate.update(sql)).thenReturn(0);

        try {
            mappingDAO.saveMapping(mappings);
        } catch(Exception e) {
            verify(jdbcTemplate, times(1)).update(sql);
            assertEquals("Could not add Mapping(s)", e.getMessage());
        }
    }

    @Test
    public void shouldGetAllTheDetailedMappings() throws NoMappingFoundException {
        String sql = "SELECT mapping_name, mapping_json, config FROM mapping;";
        Map<String, Object> htsMapping = new HashMap<>();
        htsMapping.put("mappingName", "HTS Service");
        htsMapping.put("mappingJson", "{\"UIC\": \"fjghf\", \"patient_id\": \"Asj8X\", \"patient_name\": \"jghTk9\"}");
        htsMapping.put("config", "{\"searchable\": [\"UIC\"], \"comparable\": [\"patient_id\"]}");

        Map<String, Object> tbMapping = new HashMap<>();
        tbMapping.put("mappingName", "TB Service");
        tbMapping.put("lookupTable", "{\"instance\" : \"patient\"}");
        tbMapping.put("mappingJson", "{\"patient_id\": \"Asj8X\", \"patient_name\": \"jghTk9\"}");
        tbMapping.put("config", "{\"searchable\": [\"patient_id\"], \"comparable\": [\"patient_name\"]}");

        List<Map<String, Object>>  expected = new ArrayList<>();
        expected.add(htsMapping);
        expected.add(tbMapping);

        when(jdbcTemplate.queryForList(sql)).thenReturn(expected);

        assertEquals(expected, mappingDAO.getAllMappings());

        verify(jdbcTemplate, times(1)).queryForList(sql);
    }

    @Test(expected = NoMappingFoundException.class)
    public void shouldThrowNoMappingFoundExceptionWhenNoMappingIsPresentInDatabase() throws NoMappingFoundException {
        String sql = "SELECT mapping_name, mapping_json, config FROM mapping;";
        when(jdbcTemplate.queryForList(sql)).thenThrow(EmptyResultDataAccessException.class);

        mappingDAO.getAllMappings();
    }
}
