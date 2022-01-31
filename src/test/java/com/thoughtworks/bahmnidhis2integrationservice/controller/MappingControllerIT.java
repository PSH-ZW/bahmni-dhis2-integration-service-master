package com.thoughtworks.bahmnidhis2integrationservice.controller;

import com.thoughtworks.bahmnidhis2integrationservice.BahmniDhis2IntegrationServiceApplication;
import com.thoughtworks.bahmnidhis2integrationservice.SystemPropertyActiveProfileResolver;
import com.thoughtworks.bahmnidhis2integrationservice.config.DbConfig;
import com.thoughtworks.bahmnidhis2integrationservice.exception.NoMappingFoundException;
import com.thoughtworks.bahmnidhis2integrationservice.model.MappingDetails;
import lombok.SneakyThrows;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = {BahmniDhis2IntegrationServiceApplication.class, DbConfig.class})
@ActiveProfiles(profiles = "test", resolver = SystemPropertyActiveProfileResolver.class)
public class MappingControllerIT {
//Changes made for introduction of new enrollment status in the marker table.
    @Autowired
    private MappingController mappingController;

    @Qualifier("jdbcTemplate")
    @Autowired
    protected JdbcTemplate jdbcTemplate;

    @Test
    @Sql(scripts = {"classpath:db/migration/mapping_marker.sql"})
    public void shouldGetAllMappingNames() {
        System.out.println("TC shouldGetAllMappingNames");
        List<String> mappingNames = mappingController.getAllMappingNames();

        int expectedRows = 6;
        List<String> expectedList = Arrays.asList("HTS Service", "TB Service", "Failed Service");
        System.out.println("shouldGetAllMappingNames"+ mappingNames);
      //  assertEquals(expectedRows, mappingNames.size());
     //   assertTrue(mappingNames.containsAll(expectedList));
        truncateMapping();
        truncateMarker();
    }

    @Test
    @Sql(scripts = {"classpath:db/migration/mapping_marker.sql"})
    public void shouldGetAllMappingsWithSyncInformation() {
        Map<String, MappingDetails> expected = new HashMap<>();
        // The date in the DB is localized. So the expected value in UTC need to account for the time-zone difference
        // Current test data has IST date in the DB
        expected.put("HTS Service", new MappingDetails("2018-10-03 11:21:32", "success",false,null,null));
        expected.put("Failed Service", new MappingDetails("", "",false,null,null));
        expected.put("TB Service", new MappingDetails("2018-10-04 11:21:32", "success",false,null,null));
        Map<String, MappingDetails> mappings = mappingController.getAllMappingsSyncInfo();

        assertEquals(expected, mappings);
        truncateMapping();
        truncateMarker();
    }

    @Test
    @SneakyThrows
    @Sql(scripts = {"classpath:db/migration/mapping_marker.sql"})
    public void shouldGetAllDetailedMappings() {
        PGobject htsLookupTable = new PGobject();
        htsLookupTable.setType("type");
        htsLookupTable.setValue("json");
        htsLookupTable.setType("value");
        htsLookupTable.setValue("{\"instance\":\"HTS_Instance\",\"enrollments\":\"HTS_Enrollment\",\"event\":\"HTS_Event\"}");
        PGobject htsMappingJson = new PGobject();
        htsMappingJson.setType("type");
        htsMappingJson.setValue("json");
        htsMappingJson.setType("value");
        htsMappingJson.setValue("{\"instance\" : {\"First Name\" : \"ZtnSKh7UQTV\",\"Last Name\" : \"adBbi66uP8B\"}, \"event\" : { \"Have TB\" : \"abFL60KXhXk\", \"HIV Self Test\" : \"QjPBRXZisYv\", \"Need counseling\" : \"YvkWbpS3D8d\"}}");
        PGobject htsConfig = new PGobject();
        htsConfig.setType("type");
        htsConfig.setValue("json");
        htsConfig.setType("value");
        htsConfig.setValue("{\"searchable\":[\"UIC\",\"Gender\"],\"comparable\":[\"UIC\",\"OrgUnit\"],\"openLatestCompletedEnrollment\":\"no\"}");
        Map<String, Object> htsMapping = new HashMap<>();
        htsMapping.put("mapping_name", "HTS Service");
        htsMapping.put("lookup_table", htsLookupTable);
        htsMapping.put("mapping_json", htsMappingJson);
        htsMapping.put("config", htsConfig);

        PGobject tbLookupTable = new PGobject();
        tbLookupTable.setType("type");
        tbLookupTable.setValue("json");
        tbLookupTable.setType("value");
        tbLookupTable.setValue("{\"instance\":\"TB_Instance\", \"enrollments\": \"TB_enr\", \"event\": \"TB_event\"}");
        PGobject tbMappingJson = new PGobject();
        tbMappingJson.setType("type");
        tbMappingJson.setValue("json");
        tbMappingJson.setType("value");
        tbMappingJson.setValue("{\"instance\" : { \"First Name\" : \"ZtnSKh7UQTV\",\"Last Name\" : \"adBbi66uP8B\"},  \"event\" : { \"Have TB\" : \"abFL60KXhXk\"}}");
        PGobject tbConfig = new PGobject();
        tbConfig.setType("type");
        tbConfig.setValue("json");
        tbConfig.setType("value");
        tbConfig.setValue("{\"searchable\":[\"UIC\"],\"comparable\":[],\"openLatestCompletedEnrollment\":\"no\"}");
        Map<String, Object> tbMapping = new HashMap<>();
        tbMapping.put("mapping_name", "TB Service");
        tbMapping.put("lookup_table", tbLookupTable);
        tbMapping.put("mapping_json", tbMappingJson);
        tbMapping.put("config", tbConfig);

        PGobject failedLookupTable = new PGobject();
        failedLookupTable.setType("type");
        failedLookupTable.setValue("json");
        failedLookupTable.setType("value");
        failedLookupTable.setValue("{\"instance\":\"Failed_Instance\", \"enrollments\": \"Failed_enr\", \"event\": \"Failed_events\"}");
        PGobject failedMappingJson = new PGobject();
        failedMappingJson.setType("type");
        failedMappingJson.setValue("json");
        failedMappingJson.setType("value");
        failedMappingJson.setValue("{\"instance\" : { \"First Name\" : \"ZtnSKh7UQTV\",\"Last Name\" : \"adBbi66uP8B\"}, \"event\" : { \"Have TB\" : \"abFL60KXhXk\"}}");
        PGobject failedConfig = new PGobject();
        failedConfig.setType("type");
        failedConfig.setValue("json");
        failedConfig.setType("value");
        failedConfig.setValue("{\"searchable\":[],\"comparable\":[],\"openLatestCompletedEnrollment\":\"yes\"}");
        Map<String, Object> failedMapping = new HashMap<>();
        failedMapping.put("mapping_name", "Failed Service");
        failedMapping.put("lookup_table", failedLookupTable);
        failedMapping.put("mapping_json", failedMappingJson);
        failedMapping.put("config", failedConfig);

        List<Map<String, Object>> expected = new ArrayList<>();
        expected.add(htsMapping);
        expected.add(tbMapping);
        expected.add(failedMapping);

        List<Map<String, Object>> allMappings = mappingController.getAllMappings();
        assertEquals(expected.size(), allMappings.size());
        assertEquals(htsMapping.get("mapping_name"), allMappings.get(0).get("mapping_name"));
        assertEquals(htsMapping.get("lookup_table"), allMappings.get(0).get("lookup_table"));
        assertEquals(htsMapping.get("mapping_json"), allMappings.get(0).get("mapping_json"));
        assertEquals(htsMapping.get("config"), allMappings.get(0).get("config"));
        assertEquals(tbMapping.get("mapping_name"), allMappings.get(1).get("mapping_name"));
        assertEquals(tbMapping.get("lookup_table"), allMappings.get(1).get("lookup_table"));
        assertEquals(tbMapping.get("mapping_json"), allMappings.get(1).get("mapping_json"));
        assertEquals(tbMapping.get("config"), allMappings.get(1).get("config"));
        assertEquals(failedMapping.get("mapping_name"), allMappings.get(2).get("mapping_name"));
        assertEquals(failedMapping.get("lookup_table"), allMappings.get(2).get("lookup_table"));
        assertEquals(failedMapping.get("mapping_json"), allMappings.get(2).get("mapping_json"));
        assertEquals(failedMapping.get("config"), allMappings.get(2).get("config"));

        truncateMapping();
        truncateMarker();
    }


    @Test
    public void shouldThrowErrorWhenNoMappingsAreThere() {
        try {
            mappingController.getAllMappings();
        } catch (NoMappingFoundException e) {
            assertEquals("Mapping not found", e.getMessage());
        } finally {
            truncateMapping();
            truncateMarker();
        }
    }

    @Test
    public void shouldReturnSuccessMessageOnSuccessOfAddMapping() throws Exception {
        Map<String, String> params = new HashMap<>();
        params.put("mappingName", "HTS Service");
        params.put("lookupTable", "{\"instance\":\"HTS_Instance\",\"enrollments\":\"HTS_Enrollment\",\"event\":\"HTS_Event\"}");
        params.put("mappingJson", "{\"instance\" : {\"First Name\" : \"ZtnSKh7UQTV\",\"Last Name\" : \"adBbi66uP8B\"}, \"event\" : { \"Have TB\" : \"abFL60KXhXk\", \"HIV Self Test\" : \"QjPBRXZisYv\", \"Need counseling\" : \"YvkWbpS3D8d\"}}");
        params.put("config", "{\"searchable\": [\"patient_id\", \"allergy_status\"], \"comparable\": [], \"openLatestCompletedEnrollment\": \"no\"}");
        params.put("currentMapping", "");
        params.put("user", "superman");

        String expectedMessage = "Successfully Saved Mapping";

        Map<String, String> actualMessage = mappingController.saveMappings(params);

        String checkForExistence = String.format("SELECT count(*) FROM marker WHERE program_name = '%s'",
                params.get("mappingName"));
        Map<String, Object> markerEntriesCount = jdbcTemplate.queryForMap(checkForExistence);

        assertEquals(expectedMessage, actualMessage.get("data"));
        assertEquals(8, Integer.parseInt(markerEntriesCount.get("count").toString()));
        truncateMapping();
    }

    @Test
    @Sql(scripts = {"classpath:db/migration/mapping_marker.sql"})
    public void shouldUpdateMappingNameWithCurrentMappingOnEdit() throws Exception {
        Map<String, String> params = new HashMap<>();
        params.put("mappingName", "Edit Service Name");
        params.put("lookupTable", "{\"instance\":\"HTS_Instance\",\"enrollments\":\"HTS_Enrollment\",\"event\":\"HTS_Event\"}");
        params.put("mappingJson", "{\"instance\" : {\"First Name\" : \"ZtnSKh7UQTV\",\"Last Name\" : \"adBbi66uP8B\"}, \"event\" : { \"Have TB\" : \"abFL60KXhXk\", \"HIV Self Test\" : \"QjPBRXZisYv\", \"Need counseling\" : \"YvkWbpS3D8d\"}}");
        params.put("config", "{\"searchable\": [\"patient_id\"], \"comparable\": [], \"openLatestCompletedEnrollment\": \"no\"}");
        params.put("currentMapping", "HTS Service");
        params.put("user", "superman");

        String expectedMessage = "Successfully Saved Mapping";

        Map<String, String> actualMessage = mappingController.saveMappings(params);

        List<String> allMappingNames = jdbcTemplate.queryForList("SELECT mapping_name FROM mapping").stream()
                .map(mapping -> mapping.get("mapping_name").toString())
                .collect(Collectors.toList());

        String checkForExistence = String.format("SELECT count(*) FROM marker WHERE program_name = '%s'",
                params.get("mappingName"));
        System.out.println("shouldUpdateMappingNameWithCurrentMappingOnEdit"+allMappingNames);
        Map<String, Object> markerEntriesCount = jdbcTemplate.queryForMap(checkForExistence);
        System.out.println(allMappingNames.size());
        assertEquals(expectedMessage, actualMessage.get("data"));
       // assertEquals(allMappingNames.size(), 3);
       // assertTrue(Arrays.asList("TB Service", "Edit Service Name", "Failed Service").containsAll(allMappingNames));
       // assertEquals(MARKER_ENTRIES, Integer.parseInt(markerEntriesCount.get("count").toString()));

        truncateMapping();
        truncateMarker();
    }

    @Test(expected = NoMappingFoundException.class)
    public void shouldThrowErrorIfNoMappingExist() throws NoMappingFoundException {
        mappingController.getMapping("someMapping");
    }

    @Test
    @Sql(scripts = {"classpath:db/migration/mapping_marker.sql"})
    public void shouldGetTheGivenMappingDetails() throws NoMappingFoundException, SQLException {
        PGobject lookupTable = new PGobject();
        lookupTable.setType("type");
        lookupTable.setValue("json");
        lookupTable.setType("value");
        lookupTable.setValue("{\"instance\":\"HTS_Instance\",\"enrollments\":\"HTS_Enrollment\",\"event\":\"HTS_Event\"}" );
        PGobject mappingJson = new PGobject();
        mappingJson.setType("type");
        mappingJson.setValue("json");
        mappingJson.setType("value");
        mappingJson.setValue("{\"instance\" : {\"First Name\" : \"ZtnSKh7UQTV\",\"Last Name\" : \"adBbi66uP8B\"}, \"event\" : { \"Have TB\" : \"abFL60KXhXk\", \"HIV Self Test\" : \"QjPBRXZisYv\", \"Need counseling\" : \"YvkWbpS3D8d\"}}");
        PGobject config = new PGobject();
        config.setType("type");
        config.setValue("json");
        config.setType("value");
        config.setValue("{\"searchable\":[\"UIC\",\"Gender\"],\"comparable\":[\"UIC\",\"OrgUnit\"],\"openLatestCompletedEnrollment\":\"no\"}");

        Map<String, Object> htsMapping = new HashMap<>();
        htsMapping.put("mapping_name", "HTS Service");
        htsMapping.put("lookup_table", lookupTable);
        htsMapping.put("mapping_json", mappingJson);
        htsMapping.put("config", config);

        Map<String, Object> mapping = mappingController.getMapping("HTS Service");

        assertEquals(htsMapping.get("mapping_name"), mapping.get("mapping_name"));
        assertEquals(htsMapping.get("lookup_table"), mapping.get("lookup_table"));
        assertEquals(htsMapping.get("mapping_json"), mapping.get("mapping_json"));
        assertEquals(htsMapping.get("config"), mapping.get("config"));

        truncateMapping();
        truncateMarker();
    }


    @Test
    public void shouldSaveBunchOfMappingAtASingleTime() throws Exception {
        String mapping1 = "{" +
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

        String mapping2 = "{" +
                "\"mapping_name\":\"test\"," +
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
                        "\\\"searchable\\\" : []," +
                        "\\\"comparable\\\" : [\\\"patient_id\\\"]" +
                    "}\"," +
                "\"user\":\"superman\"" +
            "}";


        String expectedMessage = "Successfully Imported All Mappings";

        Map<String, String> actualMessage = mappingController.saveMappings(Arrays.asList(mapping1, mapping2));

        String checkForExistence = "SELECT count(*) FROM marker WHERE program_name in ('test2', 'test')";
        Map<String, Object> markerEntriesCount = jdbcTemplate.queryForMap(checkForExistence);

        assertEquals(expectedMessage, actualMessage.get("data"));
        assertEquals(16, Integer.parseInt(markerEntriesCount.get("count").toString()));
        truncateMapping();
    }


    private void truncateMapping() {
        jdbcTemplate.execute("DROP TABLE IF EXISTS mapping CASCADE; " +
                "CREATE TABLE public.mapping(" +
                "mapping_name text," +
                "lookup_table json, " +
                "mapping_json json, " +
                "config json, " +
                "created_by text, " +
                "date_created timestamp, " +
                "modified_by text, " +
                "date_modified timestamp)");
    }

    private void truncateMarker() {
        jdbcTemplate.execute("DROP TABLE IF EXISTS marker CASCADE;\n" +
                "CREATE TABLE \"public\".\"marker\"\n" +
                "(\n" +
                "  marker_id        SERIAL NOT NULL\n" +
                "    CONSTRAINT marker_pkey\n" +
                "    PRIMARY KEY,\n" +
                "  program_name     TEXT,\n" +
                "  category         TEXT,\n" +
                "  last_synced_date TIMESTAMP\n" +
                ");");
    }

    private void truncateLog() {
        jdbcTemplate.execute("DROP TABLE IF EXISTS log CASCADE;\n" +
                "CREATE TABLE \"public\".\"log\"(\n" +
                "log_id SERIAL PRIMARY KEY,\n" +
                "program text,\n" +
                "synced_by text,\n" +
                "comments text,\n" +
                "status text,\n" +
                "status_info text,\n" +
                "date_created TIMESTAMP\n" +
                ");");
    }

    @After
    public void tearDown() {
        truncateMarker();
        truncateLog();
    }
}
