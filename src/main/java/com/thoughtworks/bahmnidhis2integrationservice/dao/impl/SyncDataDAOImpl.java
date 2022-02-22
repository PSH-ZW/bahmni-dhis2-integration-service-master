package com.thoughtworks.bahmnidhis2integrationservice.dao.impl;

import com.thoughtworks.bahmnidhis2integrationservice.dao.SyncDataDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class SyncDataDAOImpl implements SyncDataDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<Map<String, Object>> getEventsLeftToSync() {
        // also need to add exception handling.
        String sql = "select program_id, count(*) events_left_to_sync from events_to_sync where synced = false " +
                " group by program_id order by program_id;";
        return jdbcTemplate.queryForList(sql);
    }
}
