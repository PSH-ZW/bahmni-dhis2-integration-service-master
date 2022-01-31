#!/bin/sh
set -e -x

. /etc/bahmni-dhis2-integration-service/bahmni-dhis.conf
if [ -f /etc/bahmni-installer/bahmni.conf ]; then
. /etc/bahmni-installer/bahmni.conf
fi

CHANGE_LOG_TABLE="-Dliquibase.databaseChangeLogTableName=liquibasechangelog -Dliquibase.databaseChangeLogLockTableName=liquibasechangeloglock"
LIQUIBASE_JAR="/opt/openmrs/openmrs/WEB-INF/lib/liquibase-core-2.0.5.jar"
DRIVER="com.mysql.jdbc.Driver"
COMMON_CLASSPATH="/opt/openmrs/openmrs.war"

liquibase --driver='org.postgresql.Driver' --classpath=$postgresql_jar_location/$postgresql_jar_name --changeLogFile=$liquibase_changelog_path --defaultSchemaName='public' --url=jdbc:postgresql://$postgres_db_server:$analytics_db_port/$analytics_db_name --username=$analytics_db_user --password=$analytics_db_password update >> /bahmni_temp/logs/bahmni_deploy.log 2>> /bahmni_temp/logs/bahmni_deploy.log
java $CHANGE_LOG_TABLE -jar $LIQUIBASE_JAR --driver=$DRIVER --classpath=$COMMON_CLASSPATH --changeLogFile=$liquibase_custom_changelog_path --url=jdbc:mysql://$OPENMRS_DB_SERVER:3306/openmrs --username=$OPENMRS_DB_USERNAME --password=$OPENMRS_DB_PASSWORD update >> /bahmni_temp/logs/bahmni_deploy.log 2>> /bahmni_temp/logs/bahmni_deploy.log