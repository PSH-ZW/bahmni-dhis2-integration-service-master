package com.thoughtworks.bahmnidhis2integrationservice.config;

import com.opentable.db.postgres.embedded.EmbeddedPostgres;
import org.flywaydb.core.Flyway;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@TestConfiguration
public class DbConfig {
    @Bean
    @Primary
    public DataSource dataSource() throws Exception {
        DataSource dataSource = EmbeddedPostgres.builder().setPort(5432).
                start().getPostgresDatabase();
        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:/db/migration")
                .load();
        flyway.migrate();
        return dataSource;
    }
}