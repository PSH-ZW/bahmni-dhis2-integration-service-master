package com.thoughtworks.bahmnidhis2integrationservice.dao.impl;

import com.thoughtworks.bahmnidhis2integrationservice.dao.MappingDAO;
import com.thoughtworks.bahmnidhis2integrationservice.exception.NoMappingFoundException;
import com.thoughtworks.bahmnidhis2integrationservice.model.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import java.util.stream.Collectors;

@Component
public class MappingDAOImpl implements MappingDAO {

    @Autowired
    @Qualifier("jdbcTemplate")
    private JdbcTemplate jdbcTemplate;

    private final static int SUCCESS = 1;

    @Override
    public String saveMapping(String mappingName, String mappingJson, String config, String currentMapping, String user) throws Exception {
        int result = jdbcTemplate.update(getMappingSql(mappingName, mappingJson, config, currentMapping, user));

        if (result == SUCCESS) {
            return "Successfully Saved Mapping";
        }

        throw new Exception("Could not add Mapping");
    }

    @Override
    public List<String> getMappingNames() {
        String sql = "SELECT program_name FROM mapping";
        return jdbcTemplate.queryForList(sql).stream().map(mapping -> mapping.get("program_name").toString())
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getMapping(String programName) throws NoMappingFoundException {
        String sql = String.format("SELECT program_name, mapping_json, config FROM mapping WHERE program_name= '%s'", programName);
        try {
            return jdbcTemplate.queryForMap(sql);
        } catch (EmptyResultDataAccessException e) {
            throw new NoMappingFoundException(programName);
        }
    }

    @Override
    public String saveMapping(List<Mapping> mappingsList) throws Exception {

        StringBuilder mappingQueries = new StringBuilder();
        mappingsList.forEach(mapping -> {
            String query = getMappingSql(
                    mapping.getProgram_name(),
                    mapping.getMapping_json(),
                    mapping.getConfig(),
                    mapping.getCurrent_mapping(),
                    mapping.getUser()
            );

            mappingQueries.append(query);
        });

        int result = jdbcTemplate.update(mappingQueries.toString());

        if (result == SUCCESS) {
            return "Successfully Imported All Mappings";
        }

        throw new Exception("Could not add Mapping(s)");
    }

    @Override
    public List<Map<String, Object>> getAllMappings() throws NoMappingFoundException {
        String sql = "SELECT program_name, mapping_json, config FROM mapping;";
        try {
            return jdbcTemplate.queryForList(sql);
        } catch (EmptyResultDataAccessException e) {
            throw new NoMappingFoundException("");
        }
    }

    private String getMappingSql(String mappingName, String mappingJson, String config, String currentMapping, String user) {
        String currentTime = getCurrentTime();
        mappingJson = mappingJson.replace("'", "''"); //replace ' with '' . otherwise postgres will throw error for dhis elements names like "user's id" etc.
        return StringUtils.isEmpty(currentMapping) ?
                String.format("INSERT INTO mapping (program_name, mapping_json, config, created_by, date_created) " +
                        "VALUES ('%s', '%s', '%s', '%s', '%s');", mappingName, mappingJson, config, user, currentTime)
                : String.format("UPDATE mapping " +
                "SET program_name='%s', mapping_json='%s', config='%s', modified_by='%s', date_modified='%s' " +
                "WHERE program_name='%s';", mappingName, mappingJson, config, user, currentTime, currentMapping);
    }

    private String getCurrentTime() {
        Date date = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        dateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
        return dateFormat.format(date);
    }
}
