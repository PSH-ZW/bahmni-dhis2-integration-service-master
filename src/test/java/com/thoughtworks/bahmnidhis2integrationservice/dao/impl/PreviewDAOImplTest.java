package com.thoughtworks.bahmnidhis2integrationservice.dao.impl;

import com.thoughtworks.bahmnidhis2integrationservice.util.PreviewUtil;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.jdbc.core.JdbcTemplate;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.thoughtworks.bahmnidhis2integrationservice.CommonTestHelper.setValuesForMemberFields;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.powermock.api.mockito.PowerMockito.mockStatic;
import static org.powermock.api.mockito.PowerMockito.verifyStatic;
import static org.powermock.api.mockito.PowerMockito.when;

@RunWith(PowerMockRunner.class)
@PrepareForTest({PreviewUtil.class})
public class PreviewDAOImplTest {
    PreviewDAOImpl previewDAO;

    @Mock
    private JdbcTemplate jdbcTemplate;

    @Mock
    private Resource deltaDataResource;

    @Mock
    private BadSqlGrammarException badSqlGrammarException;

    private Map<String, Object> mappingResult;

    @Before
    public void setUp() throws Exception {
        previewDAO = new PreviewDAOImpl();
        setValuesForMemberFields(previewDAO, "jdbcTemplate", jdbcTemplate);
        setValuesForMemberFields(previewDAO, "deltaDataResource", deltaDataResource);
        mockStatic(PreviewUtil.class);

        mappingResult = new HashMap<>();
        mappingResult.put("mapping_name", "someMapping");
        mappingResult.put("lookup_table", "{\"instance\":\"patient_identifier\",\"enrollments\":\"hts_program_enrollment_view\",\"event\":\"hiv_event_view\"}");
        mappingResult.put("mapping_json", "{\"instance\":{\"UIC\":\"rOb34aQLSyC\"},\"event\":{\"self_test_outcome\":\"asdf\"}}");
    }

    @Test
    public void shouldReturnTheDeltaData() throws IOException, SQLException {
        String mappingName = "someMapping";
        String mappingSql = getMappingSql(mappingName);
        String deltaDataSql = getSql();
        String updatedSql = "Select coalesce( instanceTable.\"Patient_Identifier\",  programEnrollmentsTable.\"Patient_Identifier\",\n" +
                "                 eventsTable.\"Patient_Identifier\")                                                   as \"Patient Identifier\",\n" +
                "       (Select orgunit from orgunit_tracker where orgunit = coalesce( instanceTable.\"OrgUnit\",  programEnrollmentsTable.\"OrgUnit\",  eventsTable.\"OrgUnit\") )as \"Org Unit\",\n" +
                "       instanceTable.\"UIC\",\n" +
                "       instanceTable.date_created::text as \"Instance Date Created\",\n" +
                "        coalesce( programEnrollmentsTable.enrollment_date, eventsTable.enrollment_date) \"Enrollment Date\",\n" +
                "        programEnrollmentsTable.incident_date \"Incident Date\",\n" +
                "        programEnrollmentsTable.status \"Enrollment Status\",\n" +
                "        programEnrollmentsTable.date_created::text as \"Prog Enrollment Date Created\",\n" +
                "        eventsTable.event_date \"Event Date\",\n" +
                "        eventsTable.program \"Program\",\n" +
                "        eventsTable.program_stage \"Program Stage\",\n" +
                "        eventsTable.status \"Event Status\",\n" +
                "       eventsTable.\"self_test_outcome\",\n" +
                "        eventsTable.date_created::text as \"Event Date Created\"\n" +
                "from (Select pi.*\n" +
                "      from patient_identifier pi\n" +
                "             inner join marker m on pi.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                      and category = 'instance' AND program_name =  'someMapping') as  instanceTable FULL\n" +
                "       OUTER JOIN (           (Select prog.*\n" +
                "                   from hts_program_enrollment_view prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'new_completed_enrollment' AND\n" +
                "                                                 program_name =  'someMapping')           UNION            (Select prog.*\n" +
                "                   from hts_program_enrollment_view prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'updated_completed_enrollment' AND\n" +
                "                                                 program_name =  'someMapping')           UNION            (Select prog.*\n" +
                "                   from hts_program_enrollment_view prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'new_active_enrollment' AND\n" +
                "                                                 program_name =  'someMapping')           UNION            (Select prog.*\n" +
                "                   from hts_program_enrollment_view prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'updated_active_enrollment' AND\n" +
                "                                                 program_name =  'someMapping')           UNION            (Select prog.*\n" +
                "                   from hts_program_enrollment_view prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'updated_cancelled_enrollment' AND\n" +
                "                                                 program_name =  'someMapping')           UNION            (Select prog.*\n" +
                "                   from hts_program_enrollment_view prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'new_cancelled_enrollment' AND\n" +
                "                                                 program_name =  'someMapping')       ) as  programEnrollmentsTable\n" +
                "         On  instanceTable.\"Patient_Identifier\" =  programEnrollmentsTable.\"Patient_Identifier\" FULL\n" +
                "       OUTER JOIN (Select event.*\n" +
                "                   from hiv_event_view event\n" +
                "                          inner join marker m on event.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'event' AND\n" +
                "                                                 program_name =  'someMapping') as  eventsTable\n" +
                "         on  instanceTable.\"Patient_Identifier\" =  eventsTable.\"Patient_Identifier\"\n" +
                "         and eventsTable.enrollment_date = programEnrollmentsTable.enrollment_date\n" +
                "order by  eventsTable.date_created,  programEnrollmentsTable.date_created,  instanceTable.date_created";

        Map<String, Object> mappingResult = new HashMap<>();
        mappingResult.put("mapping_name", "someMapping");
        mappingResult.put("lookup_table", "{\"instance\":\"patient_identifier\",\"enrollments\":\"hts_program_enrollment_view\",\"event\":\"hiv_event_view\"}");
        mappingResult.put("mapping_json", "{\"instance\":{\"UIC\":\"rOb34aQLSyC\"},\"event\":{\"self_test_outcome\":\"asdf\"}}");

        Map<String, Object> record1 = new HashMap<>();
        assignValuesToMap(
                record1,
                "NAH0000000001",
                "PSI-ZIMB-NAH",
                "2018-09-12",
                "2018-09-08",
                "2018-09-08 11:20:29.693000",
                "ACTIVE",
                "2018-09-24 00:00:00.000000"
        );
        record1.put("UIC", "KLNTRA190606M");
        record1.put("self_test_outcome", "Positive");

        Map<String, Object> record2 = new HashMap<>();
        assignValuesToMap(
                record2,
                "NAH0000000002",
                "PSI-ZIMB-NAH",
                "2018-08-12",
                "2018-08-11",
                "2018-09-08 11:20:29.693000",
                "COMPLETED",
                "2018-09-24 00:00:00.000000"
        );
        record2.put("UIC", "KLSTTA180773F");
        record2.put("self_test_outcome", "Positive");

        List<Map<String, Object>> expected = Arrays.asList(record1, record2);

        when(PreviewUtil.convertResourceOutputToString(deltaDataResource)).thenReturn(deltaDataSql);
        when(jdbcTemplate.queryForMap(mappingSql)).thenReturn(mappingResult);
        when(jdbcTemplate.queryForList(updatedSql)).thenReturn(expected);

        List<Map<String, Object>> actual = previewDAO.getDeltaData(mappingName);

        Assert.assertEquals(expected, actual);
        verify(jdbcTemplate, times(1)).queryForMap(mappingSql);
        verify(jdbcTemplate, times(1)).queryForList(updatedSql);
    }

    @Test
    public void shouldAddTableTypeToTheColumnWhenTheColumnIsDuplicatedInInstanceAndEvent() throws IOException, SQLException {
        String mappingName = "someMapping";
        String mappingSql = getMappingSql(mappingName);
        String deltaDataSql = getSql();

        String updatedSql = "Select coalesce( instanceTable.\"Patient_Identifier\",  programEnrollmentsTable.\"Patient_Identifier\",\n" +
                "                 eventsTable.\"Patient_Identifier\")                                                   as \"Patient Identifier\",\n" +
                "       (Select orgunit from orgunit_tracker where orgunit = coalesce( instanceTable.\"OrgUnit\",  programEnrollmentsTable.\"OrgUnit\",  eventsTable.\"OrgUnit\") )as \"Org Unit\",\n" +
                "       instanceTable.\"UIC\",instanceTable.\"duplicate_column\" AS \"Instance Duplicate_column\",\n" +
                "       instanceTable.date_created::text as \"Instance Date Created\",\n" +
                "        coalesce( programEnrollmentsTable.enrollment_date, eventsTable.enrollment_date) \"Enrollment Date\",\n" +
                "        programEnrollmentsTable.incident_date \"Incident Date\",\n" +
                "        programEnrollmentsTable.status \"Enrollment Status\",\n" +
                "        programEnrollmentsTable.date_created::text as \"Prog Enrollment Date Created\",\n" +
                "        eventsTable.event_date \"Event Date\",\n" +
                "        eventsTable.program \"Program\",\n" +
                "        eventsTable.program_stage \"Program Stage\",\n" +
                "        eventsTable.status \"Event Status\",\n" +
                "       eventsTable.\"self_test_outcome\",eventsTable.\"duplicate_column\" AS \"Event Duplicate_column\",\n" +
                "        eventsTable.date_created::text as \"Event Date Created\"\n" +
                "from (Select pi.*\n" +
                "      from patient_identifier pi\n" +
                "             inner join marker m on pi.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                      and category = 'instance' AND program_name =  'someMapping') as  instanceTable FULL\n" +
                "       OUTER JOIN (" +
                "           (Select prog.*\n" +
                "                   from hts_program_enrollment_view prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'new_completed_enrollment' AND\n" +
                "                                                 program_name =  'someMapping')" +
                "           UNION " +
                "           (Select prog.*\n" +
                "                   from hts_program_enrollment_view prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'updated_completed_enrollment' AND\n" +
                "                                                 program_name =  'someMapping')" +
                "           UNION " +
                "           (Select prog.*\n" +
                "                   from hts_program_enrollment_view prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'new_active_enrollment' AND\n" +
                "                                                 program_name =  'someMapping')" +
                "           UNION " +
                "           (Select prog.*\n" +
                "                   from hts_program_enrollment_view prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'updated_active_enrollment' AND\n" +
                "                                                 program_name =  'someMapping')" +
                "           UNION " +
                "           (Select prog.*\n" +
                "                   from hts_program_enrollment_view prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'updated_cancelled_enrollment' AND\n" +
                "                                                 program_name =  'someMapping')" +
                "           UNION " +
                "           (Select prog.*\n" +
                "                   from hts_program_enrollment_view prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'new_cancelled_enrollment' AND\n" +
                "                                                 program_name =  'someMapping')" +
                "       ) as  programEnrollmentsTable\n" +
                "         On  instanceTable.\"Patient_Identifier\" =  programEnrollmentsTable.\"Patient_Identifier\" FULL\n" +
                "       OUTER JOIN (Select event.*\n" +
                "                   from hiv_event_view event\n" +
                "                          inner join marker m on event.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'event' AND\n" +
                "                                                 program_name =  'someMapping') as  eventsTable\n" +
                "         on  instanceTable.\"Patient_Identifier\" =  eventsTable.\"Patient_Identifier\"\n" +
                "         and eventsTable.enrollment_date = programEnrollmentsTable.enrollment_date\n" +
                "order by  eventsTable.date_created,  programEnrollmentsTable.date_created,  instanceTable.date_created";

        Map<String, Object> mappingResult = new HashMap<>();
        mappingResult.put("mapping_name", "someMapping");
        mappingResult.put("lookup_table",
                "{" +
                    "\"instance\":\"patient_identifier\"," +
                    "\"enrollments\":\"hts_program_enrollment_view\"," +
                    "\"event\":\"hiv_event_view\"" +
                "}"
        );
        mappingResult.put("mapping_json",
                "{" +
                    "\"instance\":{" +
                        "\"UIC\":\"rOb34aQLSyC\", " +
                        "\"duplicate_column\": \"ErUi3Kfd\"" +
                    "}," +
                    "\"event\":{" +
                        "\"self_test_outcome\":\"asdf\"," +
                        "\"duplicate_column\":\"LJSiNabQ\"" +
                    "}" +
                "}"
        );
        Map<String, Object> record1 = new HashMap<>();
        assignValuesToMap(
                record1,
                "NAH0000000001",
                "PSI-ZIMB-NAH",
                "2018-09-12",
                "2018-09-08",
                "2018-09-08 11:20:29.693000",
                "ACTIVE",
                "2018-09-24 00:00:00.000000"
        );
        record1.put("UIC", "KLNTRA190606M");
        record1.put("self_test_outcome", "Positive");
        record1.put("instance.duplicate_column", "True");
        record1.put("Event Duplicate_column", "False");

        Map<String, Object> record2 = new HashMap<>();
        assignValuesToMap(
                record2,
                "NAH0000000002",
                "PSI-ZIMB-NAH",
                "2018-08-12",
                "2018-08-11",
                "2018-09-08 11:20:29.693000",
                "COMPLETED",
                "2018-09-24 00:00:00.000000"
        );
        record2.put("UIC", "KLSTTA180773F");
        record2.put("self_test_outcome", "Positive");
        record2.put("Event Duplicate_column", "True");

        List<Map<String, Object>> expected = Arrays.asList(record1, record2);



        when(PreviewUtil.convertResourceOutputToString(deltaDataResource)).thenReturn(deltaDataSql);
        when(jdbcTemplate.queryForMap(mappingSql)).thenReturn(mappingResult);
        when(jdbcTemplate.queryForList(updatedSql)).thenReturn(expected);

        List<Map<String, Object>> actual = previewDAO.getDeltaData(mappingName);



        Assert.assertEquals(actual, expected);
        verify(jdbcTemplate, times(1)).queryForMap(mappingSql);
        verify(jdbcTemplate, times(1)).queryForList(updatedSql);
    }

    @Test
    public void shouldDisplayTheDefaultColumnsOnlyOnceIrrespectiveOfMappingProvided() throws IOException, SQLException {
        String mappingName = "someMapping";
        String mappingSql = getMappingSql(mappingName);
        String deltaDataSql = getSql();

        String updatedSql = "Select coalesce( instanceTable.\"Patient_Identifier\",  programEnrollmentsTable.\"Patient_Identifier\",\n" +
                "                 eventsTable.\"Patient_Identifier\")                                                   as \"Patient Identifier\",\n" +
                "       (Select orgunit from orgunit_tracker where orgunit = coalesce( instanceTable.\"OrgUnit\",  programEnrollmentsTable.\"OrgUnit\",  eventsTable.\"OrgUnit\") )as \"Org Unit\",\n" +
                "       instanceTable.\"UIC\",instanceTable.\"duplicate_column\" AS \"Instance Duplicate_column\",\n" +
                "       instanceTable.date_created::text as \"Instance Date Created\",\n" +
                "        coalesce( programEnrollmentsTable.enrollment_date, eventsTable.enrollment_date) \"Enrollment Date\",\n" +
                "        programEnrollmentsTable.incident_date \"Incident Date\",\n" +
                "        programEnrollmentsTable.status \"Enrollment Status\",\n" +
                "        programEnrollmentsTable.date_created::text as \"Prog Enrollment Date Created\",\n" +
                "        eventsTable.event_date \"Event Date\",\n" +
                "        eventsTable.program \"Program\",\n" +
                "        eventsTable.program_stage \"Program Stage\",\n" +
                "        eventsTable.status \"Event Status\",\n" +
                "       eventsTable.\"self_test_outcome\",eventsTable.\"duplicate_column\" AS \"Event Duplicate_column\",\n" +
                "        eventsTable.date_created::text as \"Event Date Created\"\n" +
                "from (Select pi.*\n" +
                "      from patient_identifier pi\n" +
                "             inner join marker m on pi.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                      and category = 'instance' AND program_name =  'someMapping') as  instanceTable FULL\n" +
                "       OUTER JOIN (           (Select prog.*\n" +
                "                   from hts_program_enrollment_view prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'new_completed_enrollment' AND\n" +
                "                                                 program_name =  'someMapping')           UNION            (Select prog.*\n" +
                "                   from hts_program_enrollment_view prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'updated_completed_enrollment' AND\n" +
                "                                                 program_name =  'someMapping')           UNION            (Select prog.*\n" +
                "                   from hts_program_enrollment_view prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'new_active_enrollment' AND\n" +
                "                                                 program_name =  'someMapping')           UNION            (Select prog.*\n" +
                "                   from hts_program_enrollment_view prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'updated_active_enrollment' AND\n" +
                "                                                 program_name =  'someMapping')           UNION            (Select prog.*\n" +
                "                   from hts_program_enrollment_view prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'updated_cancelled_enrollment' AND\n" +
                "                                                 program_name =  'someMapping')           UNION            (Select prog.*\n" +
                "                   from hts_program_enrollment_view prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'new_cancelled_enrollment' AND\n" +
                "                                                 program_name =  'someMapping')       ) as  programEnrollmentsTable\n" +

                "         On  instanceTable.\"Patient_Identifier\" =  programEnrollmentsTable.\"Patient_Identifier\" FULL\n" +
                "       OUTER JOIN (Select event.*\n" +
                "                   from hiv_event_view event\n" +
                "                          inner join marker m on event.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'event' AND\n" +
                "                                                 program_name =  'someMapping') as  eventsTable\n" +
                "         on  instanceTable.\"Patient_Identifier\" =  eventsTable.\"Patient_Identifier\"\n" +
                "         and eventsTable.enrollment_date = programEnrollmentsTable.enrollment_date\n" +
                "order by  eventsTable.date_created,  programEnrollmentsTable.date_created,  instanceTable.date_created";

        Map<String, Object> mappingResult = new HashMap<>();
        //{lookup_table={"instance":"patient_identifier","enrollments":"hts_program_enrollment_view","event":"hiv_event_view"}, mapping_name=someMapping,
        // mapping_json={"instance":{"UIC":"rOb34aQLSyC", "duplicate_column": "ErUi3Kfd"},"event":{"self_test_outcome":"asdf","duplicate_column":"LJSiNabQ"}}}
        mappingResult.put("mapping_name", "someMapping");
        mappingResult.put("lookup_table",
                "{" +
                    "\"instance\":\"patient_identifier\"," +
                    "\"enrollments\":\"hts_program_enrollment_view\"," +
                    "\"event\":\"hiv_event_view\"" +
                "}"
        );
        mappingResult.put("mapping_json",
                "{" +
                    "\"instance\":{" +
                        "\"UIC\":\"rOb34aQLSyC\", " +
                        "\"duplicate_column\": \"ErUi3Kfd\"" +
                    "}," +
                    "\"event\":{" +
                        "\"self_test_outcome\":\"asdf\"," +
                        "\"duplicate_column\":\"LJSiNabQ\"" +
                    "}" +
                "}"
        );
        Map<String, Object> record1 = new HashMap<>();
        assignValuesToMap(
                record1,
                "NAH0000000001",
                "PSI-ZIMB-NAH",
                "2018-09-12",
                "2018-09-08",
                "2018-09-08 11:20:29.693000",
                "ACTIVE",
                "2018-09-24 00:00:00.000000"
        );
        record1.put("UIC", "KLNTRA190606M");
        record1.put("self_test_outcome", "Positive");
        record1.put("instance.duplicate_column", "True");
        record1.put("event.duplicate_column", "False");

        Map<String, Object> record2 = new HashMap<>();
        assignValuesToMap(
                record2,
                "NAH0000000002",
                "PSI-ZIMB-NAH",
                "2018-08-12",
                "2018-08-11",
                "2018-09-08 11:20:29.693000",
                "COMPLETED",
                "2018-09-24 00:00:00.000000"
        );
        record2.put("UIC", "KLSTTA180773F");
        record2.put("self_test_outcome", "Positive");
        record2.put("event.duplicate_column", "True");

        List<Map<String, Object>> expected = Arrays.asList(record1, record2);

        when(PreviewUtil.convertResourceOutputToString(deltaDataResource)).thenReturn(deltaDataSql);
        when(jdbcTemplate.queryForMap(mappingSql)).thenReturn(mappingResult);
        when(jdbcTemplate.queryForList(updatedSql)).thenReturn(expected);

        List<Map<String, Object>> actual = previewDAO.getDeltaData(mappingName);

        Assert.assertEquals(actual, expected);
        verify(jdbcTemplate, times(1)).queryForMap(mappingSql);
        verify(jdbcTemplate, times(1)).queryForList(updatedSql);
    }

    @Test(expected = BadSqlGrammarException.class)
    public void shouldThrowErrorWhenTheMappingIsNotValid() throws BadSqlGrammarException, IOException {
        String mappingName = "invalidMapping";
        String mappingSql = getMappingSql(mappingName);
        String deltaDataSql = getSql();
        String updatedSql = "Select coalesce( instanceTable.\"Patient_Identifier\",  programEnrollmentsTable.\"Patient_Identifier\",\n" +
                "                 eventsTable.\"Patient_Identifier\")                                                   as \"Patient Identifier\",\n" +
                "       (Select orgunit from orgunit_tracker where orgunit = coalesce( instanceTable.\"OrgUnit\",  programEnrollmentsTable.\"OrgUnit\",  eventsTable.\"OrgUnit\") )as \"Org Unit\",\n" +
                "       instanceTable.\"UIC\",\n" +
                "       instanceTable.date_created::text as \"Instance Date Created\",\n" +
                "        coalesce( programEnrollmentsTable.enrollment_date, eventsTable.enrollment_date) \"Enrollment Date\",\n" +
                "        programEnrollmentsTable.incident_date \"Incident Date\",\n" +
                "        programEnrollmentsTable.status \"Enrollment Status\",\n" +
                "        programEnrollmentsTable.date_created::text as \"Prog Enrollment Date Created\",\n" +
                "        eventsTable.event_date \"Event Date\",\n" +
                "        eventsTable.program \"Program\",\n" +
                "        eventsTable.program_stage \"Program Stage\",\n" +
                "        eventsTable.status \"Event Status\",\n" +
                "       eventsTable.\"self_test_outcome\",\n" +
                "        eventsTable.date_created::text as \"Event Date Created\"\n" +
                "from (Select pi.*\n" +
                "      from patient_identifier pi\n" +
                "             inner join marker m on pi.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                      and category = 'instance' AND program_name =  'invalidMapping') as  instanceTable FULL\n" +
                "       OUTER JOIN (           (Select prog.*\n" +
                "                   from hts_program_enrollment_view prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'new_completed_enrollment' AND\n" +
                "                                                 program_name =  'invalidMapping')           UNION            (Select prog.*\n" +
                "                   from hts_program_enrollment_view prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'updated_completed_enrollment' AND\n" +
                "                                                 program_name =  'invalidMapping')           UNION            (Select prog.*\n" +
                "                   from hts_program_enrollment_view prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'new_active_enrollment' AND\n" +
                "                                                 program_name =  'invalidMapping')           UNION            (Select prog.*\n" +
                "                   from hts_program_enrollment_view prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'updated_active_enrollment' AND\n" +
                "                                                 program_name =  'invalidMapping')           UNION            (Select prog.*\n" +
                "                   from hts_program_enrollment_view prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'updated_cancelled_enrollment' AND\n" +
                "                                                 program_name =  'invalidMapping')           UNION            (Select prog.*\n" +
                "                   from hts_program_enrollment_view prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'new_cancelled_enrollment' AND\n" +
                "                                                 program_name =  'invalidMapping')       ) as  programEnrollmentsTable\n" +
                "         On  instanceTable.\"Patient_Identifier\" =  programEnrollmentsTable.\"Patient_Identifier\" FULL\n" +
                "       OUTER JOIN (Select event.*\n" +
                "                   from hiv_event_view event\n" +
                "                          inner join marker m on event.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'event' AND\n" +
                "                                                 program_name =  'invalidMapping') as  eventsTable\n" +
                "         on  instanceTable.\"Patient_Identifier\" =  eventsTable.\"Patient_Identifier\"\n" +
                "         and eventsTable.enrollment_date = programEnrollmentsTable.enrollment_date\n" +
                "order by  eventsTable.date_created,  programEnrollmentsTable.date_created,  instanceTable.date_created";

        when(PreviewUtil.convertResourceOutputToString(deltaDataResource)).thenReturn(deltaDataSql);
        when(jdbcTemplate.queryForList(updatedSql)).thenThrow(badSqlGrammarException);

        when(jdbcTemplate.queryForMap(mappingSql)).thenReturn(mappingResult);

        previewDAO.getDeltaData(mappingName);
    }

//    @Test
//    public void shouldNotAddNewColumnsToTheSelectClauseWhenMappingOnlyExistForDefaultColumns() throws IOException {
//        String mappingName = "someMapping";
//        String mappingSql = getMappingSql(mappingName);
//        String deltaDataSql = getSql();
//
//        String updatedSql = "Select coalesce( instanceTable.\"Patient_Identifier\",  programEnrollmentsTable.\"Patient_Identifier\",\n" +
//                "                 eventsTable.\"Patient_Identifier\")                                                   as \"Patient Identifier\",\n" +
//                "       (Select orgunit from orgunit_tracker where orgunit = coalesce( instanceTable.\"OrgUnit\",  programEnrollmentsTable.\"OrgUnit\",  eventsTable.\"OrgUnit\") )as \"Org Unit\",\n" +
//                "       instanceTable.date_created::text as \"Instance Date Created\",\n" +
//                "        coalesce( programEnrollmentsTable.enrollment_date, eventsTable.enrollment_date) \"Enrollment Date\",\n" +
//                "        programEnrollmentsTable.incident_date \"Incident Date\",\n" +
//                "        programEnrollmentsTable.status \"Enrollment Status\",\n" +
//                "        programEnrollmentsTable.date_created::text as \"Prog Enrollment Date Created\",\n" +
//                "        eventsTable.event_date \"Event Date\",\n" +
//                "        eventsTable.program \"Program\",\n" +
//                "        eventsTable.program_stage \"Program Stage\",\n" +
//                "        eventsTable.status \"Event Status\",\n" +
//                "        eventsTable.date_created::text as \"Event Date Created\"\n" +
//                "from (Select pi.*\n" +
//                "      from patient_identifier pi\n" +
//                "             inner join marker m on pi.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
//                "                                      and category = 'instance' AND program_name =  'someMapping') as  instanceTable FULL\n" +
//                "       OUTER JOIN (           (Select prog.*\n" +
//                "                   from hts_program_enrollment_view prog\n" +
//                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
//                "                                                   and category = 'new_completed_enrollment' AND\n" +
//                "                                                 program_name =  'someMapping')           UNION            (Select prog.*\n" +
//                "                   from hts_program_enrollment_view prog\n" +
//                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
//                "                                                   and category = 'updated_completed_enrollment' AND\n" +
//                "                                                 program_name =  'someMapping')           UNION            (Select prog.*\n" +
//                "                   from hts_program_enrollment_view prog\n" +
//                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
//                "                                                   and category = 'new_active_enrollment' AND\n" +
//                "                                                 program_name =  'someMapping')           UNION            (Select prog.*\n" +
//                "                   from hts_program_enrollment_view prog\n" +
//                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
//                "                                                   and category = 'updated_active_enrollment' AND\n" +
//                "                                                 program_name =  'someMapping')       ) as  programEnrollmentsTable\n" +
//                "         On  instanceTable.\"Patient_Identifier\" =  programEnrollmentsTable.\"Patient_Identifier\" FULL\n" +
//                "       OUTER JOIN (Select event.*\n" +
//                "                   from hiv_event_view event\n" +
//                "                          inner join marker m on event.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
//                "                                                   and category = 'event' AND\n" +
//                "                                                 program_name =  'someMapping') as  eventsTable\n" +
//                "         on  instanceTable.\"Patient_Identifier\" =  eventsTable.\"Patient_Identifier\"\n" +
//                "         and eventsTable.enrollment_date = programEnrollmentsTable.enrollment_date\n" +
//                "order by  eventsTable.date_created,  programEnrollmentsTable.date_created,  instanceTable.date_created";
//
//        Map<String, Object> mappingResult = new HashMap<>();
//        mappingResult.put("mapping_name", "someMapping");
//        mappingResult.put("lookup_table",
//                "{" +
//                        "\"instance\":\"patient_identifier\"," +
//                        "\"enrollments\":\"hts_program_enrollment_view\"," +
//                        "\"event\":\"hiv_event_view\"" +
//                        "}"
//        );
//        mappingResult.put("mapping_json",
//                "{" +
//                        "\"instance\":{" +
//                        "\"Patient_Identifier\":\"rOb34aQLSyC\", " +
//                        "\"date_created\": \"ErUi3Kfd\"" +
//                        "}," +
//                        "\"event\":{" +
//                        "\"Patient_Identifier\":\"asdf\"," +
//                        "\"date_created\":\"LJSiNabQ\"" +
//                        "}" +
//                        "}"
//        );
//        Map<String, Object> record1 = new HashMap<>();
//        assignValuesToMap(
//                record1,
//                "NAH0000000001",
//                "PSI-ZIMB-NAH",
//                "2018-09-12",
//                "2018-09-08",
//                "2018-09-08 11:20:29.693000",
//                "ACTIVE",
//                "2018-09-24 00:00:00.000000"
//        );
//
//        Map<String, Object> record2 = new HashMap<>();
//        assignValuesToMap(
//                record2,
//                "NAH0000000002",
//                "PSI-ZIMB-NAH",
//                "2018-08-12",
//                "2018-08-11",
//                "2018-09-08 11:20:29.693000",
//                "COMPLETED",
//                "2018-09-24 00:00:00.000000"
//        );
//
//        List<Map<String, Object>> expected = Arrays.asList(record1, record2);
//
//        when(PreviewUtil.convertResourceOutputToString(deltaDataResource)).thenReturn(deltaDataSql);
//        when(jdbcTemplate.queryForMap(mappingSql)).thenReturn(mappingResult);
//        when(jdbcTemplate.queryForList(updatedSql)).thenReturn(expected);
//
//        List<Map<String, Object>> actual = previewDAO.getDeltaData(mappingName);
//
//        Assert.assertEquals(actual, expected);
//        verify(jdbcTemplate, times(1)).queryForMap(mappingSql);
//        verify(jdbcTemplate, times(1)).queryForList(updatedSql);
//
//    }


    @Test
    public void shouldThrowErrorWhenConvertResourceToStringIsFailed() throws BadSqlGrammarException, IOException {
        String mappingName = "invalidMapping";
        String mappingSql = getMappingSql(mappingName);

        when(jdbcTemplate.queryForMap(mappingSql)).thenReturn(mappingResult);
        when(PreviewUtil.convertResourceOutputToString(deltaDataResource)).thenThrow(new IOException("Failed to Convert"));
        when(jdbcTemplate.queryForList("")).thenThrow(badSqlGrammarException);

        try {
            previewDAO.getDeltaData(mappingName);
        } catch (BadSqlGrammarException e) {
            verify(jdbcTemplate, times(1)).queryForMap(mappingSql);
            verifyStatic(times(1));
            PreviewUtil.convertResourceOutputToString(deltaDataResource);
            verify(jdbcTemplate, times(1)).queryForList("");
        }
    }


    private String getMappingSql(String mappingName) {
        StringBuilder mappingSql = new StringBuilder("SELECT * FROM mapping WHERE mapping_name='");
        mappingSql.append(mappingName);
        mappingSql.append("'");
        return mappingSql.toString();
    }


    private void assignValuesToMap(
            Map<String, Object> map,
            String patientIdentifier,
            String orgUnit,
            String enrollmentDate,
            String incidentDate,
            String enrollmentCreatedDate,
            String eventStatus,
            String eventDateCreated
            ) {
        map.put("Patient Identifier", patientIdentifier);
        map.put("Org Unit", orgUnit);

        map.put("Enrollment Date", enrollmentDate);
        map.put("Incident Date", incidentDate);
        map.put("Enrollment Date Created", enrollmentCreatedDate);
        map.put("status", "ACTIVE");

        map.put("Event Date", "2018-09-27");
        map.put("Event Status", eventStatus);
        map.put("Event Date Created", eventDateCreated);
        map.put("Prog Enrollment Date Created", enrollmentCreatedDate);
    }

    private String getSql() {
        return "Select coalesce( instanceTable.\"Patient_Identifier\",  programEnrollmentsTable.\"Patient_Identifier\",\n" +
                "                 eventsTable.\"Patient_Identifier\")                                                   as \"Patient Identifier\",\n" +
                "       (Select orgunit from orgunit_tracker where orgunit = coalesce( instanceTable.\"OrgUnit\",  programEnrollmentsTable.\"OrgUnit\",  eventsTable.\"OrgUnit\") )as \"Org Unit\",\n" +
                "       %s\n" +
                "       instanceTable.date_created::text as \"Instance Date Created\",\n" +
                "        coalesce( programEnrollmentsTable.enrollment_date, eventsTable.enrollment_date) \"Enrollment Date\",\n" +
                "        programEnrollmentsTable.incident_date \"Incident Date\",\n" +
                "        programEnrollmentsTable.status \"Enrollment Status\",\n" +
                "        programEnrollmentsTable.date_created::text as \"Prog Enrollment Date Created\",\n" +
                "        eventsTable.event_date \"Event Date\",\n" +
                "        eventsTable.program \"Program\",\n" +
                "        eventsTable.program_stage \"Program Stage\",\n" +
                "        eventsTable.status \"Event Status\",\n" +
                "       %s\n" +
                "        eventsTable.date_created::text as \"Event Date Created\"\n" +
                "from (Select pi.*\n" +
                "      from %s pi\n" +
                "             inner join marker m on pi.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                      and category = 'instance' AND program_name =  '%s') as  instanceTable FULL\n" +
                "       OUTER JOIN (" +
                "           (Select prog.*\n" +
                "                   from %s prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'new_completed_enrollment' AND\n" +
                "                                                 program_name =  '%s')" +
                "           UNION " +
                "           (Select prog.*\n" +
                "                   from %s prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'updated_completed_enrollment' AND\n" +
                "                                                 program_name =  '%s')" +
                "           UNION " +
                "           (Select prog.*\n" +
                "                   from %s prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'new_active_enrollment' AND\n" +
                "                                                 program_name =  '%s')" +
                "           UNION " +
                "           (Select prog.*\n" +
                "                   from %s prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'updated_active_enrollment' AND\n" +
                "                                                 program_name =  '%s')" +
                "           UNION " +
                "           (Select prog.*\n" +
                "                   from %s prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'updated_cancelled_enrollment' AND\n" +
                "                                                 program_name =  '%s')" +
                "           UNION " +
                "           (Select prog.*\n" +
                "                   from %s prog\n" +
                "                          inner join marker m on prog.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'new_cancelled_enrollment' AND\n" +
                "                                                 program_name =  '%s')" +
                "       ) as  programEnrollmentsTable\n" +
                "         On  instanceTable.\"Patient_Identifier\" =  programEnrollmentsTable.\"Patient_Identifier\" FULL\n" +
                "       OUTER JOIN (Select event.*\n" +
                "                   from %s event\n" +
                "                          inner join marker m on event.date_created::timestamp > coalesce(m.last_synced_date, '-infinity')\n" +
                "                                                   and category = 'event' AND\n" +
                "                                                 program_name =  '%s') as  eventsTable\n" +
                "         on  instanceTable.\"Patient_Identifier\" =  eventsTable.\"Patient_Identifier\"\n" +
                "         and eventsTable.enrollment_date = programEnrollmentsTable.enrollment_date\n" +
                "order by  eventsTable.date_created,  programEnrollmentsTable.date_created,  instanceTable.date_created";
    }
}
