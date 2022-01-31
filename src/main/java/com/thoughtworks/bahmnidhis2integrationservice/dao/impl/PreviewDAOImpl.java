package com.thoughtworks.bahmnidhis2integrationservice.dao.impl;

import com.google.gson.GsonBuilder;
import com.thoughtworks.bahmnidhis2integrationservice.dao.PreviewDAO;
import com.thoughtworks.bahmnidhis2integrationservice.model.LookupTable;
import com.thoughtworks.bahmnidhis2integrationservice.model.MappingJson;
import com.thoughtworks.bahmnidhis2integrationservice.util.PreviewUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Component
public class PreviewDAOImpl implements PreviewDAO {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Value("classpath:sql/deltaData.sql")
    private Resource deltaDataResource;

    @Value("classpath:sql/deltaDataWithDateRange.sql")
    private Resource deltaDataResourceWithStartAndEndDate;

    private static String ALIAS_NAME_OF_INSTANCE_TABLE = "instanceTable";
    private static String ALIAS_NAME_OF_EVENT_TABLE = "eventsTable";
    private static String INSTANCE = "instance";
    private static String EVENT = "event";
    private static List<String> INSTANCE_DEFAULT_COLUMNS = Arrays.asList("Patient_Identifier", "OrgUnit", "date_created");
    private static List<String> EVENT_DEFAULT_COLUMNS = Arrays.asList("Patient_Identifier", "OrgUnit", "date_created", "event_date", "program", "program_stage", "status");

    @Override
    public List<Map<String, Object>> getDeltaData(String mappingName) {
        String deltaDataSql = "";

        String mappingSql = getMappingQuery(mappingName);

        Map<String, Object> mapping = jdbcTemplate.queryForMap(mappingSql);

        try {
            deltaDataSql = PreviewUtil.convertResourceOutputToString(deltaDataResource);

        } catch (IOException e) {
            e.printStackTrace();
        }

        GsonBuilder builder = new GsonBuilder();

        LookupTable lookupTable = builder.create().fromJson(mapping.get("lookup_table").toString(), LookupTable.class);

        MappingJson mappingJson = builder.create().fromJson(mapping.get("mapping_json").toString(), MappingJson.class);

        StringBuilder instanceFields = getSelectClauseForMappedFields(mappingJson.getInstance().keySet(), ALIAS_NAME_OF_INSTANCE_TABLE,
                        mappingJson.getEvent().keySet(), INSTANCE, INSTANCE_DEFAULT_COLUMNS);
        StringBuilder eventsFields = getSelectClauseForMappedFields(mappingJson.getEvent().keySet(), ALIAS_NAME_OF_EVENT_TABLE, mappingJson.getInstance().keySet(),
                        EVENT, EVENT_DEFAULT_COLUMNS);
        String sql = String.format(
                deltaDataSql,
                instanceFields.toString(),
                eventsFields.toString(),
                lookupTable.getInstance(),
                mappingName,
                lookupTable.getEnrollments(),
                mappingName,
                lookupTable.getEnrollments(),
                mappingName,
                lookupTable.getEnrollments(),
                mappingName,
                lookupTable.getEnrollments(),
                mappingName,
                lookupTable.getEnrollments(),
                mappingName,
                lookupTable.getEnrollments(),
                mappingName,
                lookupTable.getEvent(),
                mappingName
        );

        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql);

        return result;
    }

    @Override
    public List<Map<String, Object>> getDeltaDataForDateRange(String mappingName, Date startDateNew, Date endDateNew)  {
        String deltaDataWithDateRangeSql = "";

        String mappingSql = getMappingQuery(mappingName);

        Map<String, Object> mapping = jdbcTemplate.queryForMap(mappingSql);

        try {
            deltaDataWithDateRangeSql = PreviewUtil.convertResourceOutputToString(deltaDataResourceWithStartAndEndDate);

        } catch (IOException e) {
            e.printStackTrace();
        }

        GsonBuilder builder = new GsonBuilder();

        LookupTable lookupTable = builder.create().fromJson(mapping.get("lookup_table").toString(), LookupTable.class);

        MappingJson mappingJson = builder.create().fromJson(mapping.get("mapping_json").toString(), MappingJson.class);

        StringBuilder instanceFields = getSelectClauseForMappedFields(mappingJson.getInstance().keySet(), ALIAS_NAME_OF_INSTANCE_TABLE,
                mappingJson.getEvent().keySet(), INSTANCE, INSTANCE_DEFAULT_COLUMNS);
        StringBuilder eventsFields = getSelectClauseForMappedFields(mappingJson.getEvent().keySet(), ALIAS_NAME_OF_EVENT_TABLE, mappingJson.getInstance().keySet(),
                EVENT, EVENT_DEFAULT_COLUMNS);
        String startDate = getDateWithoutTime(startDateNew);
        String endDate = getDateWithoutTime(endDateNew);
        String sql = String.format(
                deltaDataWithDateRangeSql,
                instanceFields.toString(),
                eventsFields.toString(),
                lookupTable.getInstance(),
                endDate,
                mappingName,
                lookupTable.getEnrollments(),
                startDate,
                endDate,
                mappingName,
                lookupTable.getEnrollments(),
                startDate,
                endDate,
                mappingName,
                lookupTable.getEnrollments(),
                startDate,
                endDate,
                mappingName,
                lookupTable.getEnrollments(),
                startDate,
                endDate,
                mappingName,
                lookupTable.getEnrollments(),
                startDate,
                endDate,
                mappingName,
                lookupTable.getEnrollments(),
                startDate,
                endDate,
                mappingName,
                lookupTable.getEvent(),
                startDate,
                endDate,
                mappingName
        );

        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql);

        return result;
    }

    private String getMappingQuery(String mappingName) {
        StringBuilder mappingSql = new StringBuilder("SELECT * FROM mapping WHERE mapping_name='");
        mappingSql.append(mappingName);
        mappingSql.append("'");
        return mappingSql.toString();
    }

    private StringBuilder getSelectClauseForMappedFields(Set currentTableFields, String aliasNameOfTable, Set otherTableFields, String currentTableType, List<String> defaultColumns) {
        StringBuilder fields = new StringBuilder();
        currentTableFields.forEach(field -> {
            if (!defaultColumns.contains(field.toString())) {
                fields.append(otherTableFields.contains(field) ?
                    String.format("%s.\"%s\" AS \"%s %s\",", aliasNameOfTable, field, StringUtils.capitalize(currentTableType), StringUtils.capitalize(field.toString()))
                    :String.format("%s.\"%s\",", aliasNameOfTable, field));
            }
        });
        return fields;
    }

    private String getDateWithoutTime(Date date)  {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String format = formatter.format(date);
        return format;
    }
}
