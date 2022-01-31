#!/bin/bash

if [ -f /etc/bahmni-installer/bahmni.conf ]; then
. /etc/bahmni-installer/bahmni.conf
fi

if [ -f /etc/bahmni-dhis2-integration-service/bahmni-dhis.conf ]; then
. /etc/bahmni-dhis2-integration-service/bahmni-dhis.conf
fi

USERID=bahmni
GROUPID=bahmni
/bin/id -g $GROUPID 2>/dev/null
[ $? -eq 1 ]
groupadd bahmni

/bin/id $USERID 2>/dev/null
[ $? -eq 1 ]
useradd -g bahmni bahmni

create_bahmni_dhis_directories() {
    if [ ! -d /opt/bahmni-dhis2-integration-service/log/ ]; then
        mkdir -p /opt/bahmni-dhis2-integration-service/log/
    fi

    if [ ! -d /opt/bahmni-dhis2-integration-service/properties/ ]; then
        mkdir -p /opt/bahmni-dhis2-integration-service/properties/
    fi

    if [ ! -d /var/run/bahmni-dhis2-integration-service/ ]; then
        mkdir -p /var/run/bahmni-dhis2-integration-service
    fi
}

getpostgresjar() {
    if [ ! -f /opt/bahmni-mart/lib/postgresql-42.2.2.jar ]; then
        wget https://jdbc.postgresql.org/download/postgresql-42.2.2.jar -O /opt/bahmni-mart/lib/postgresql-42.2.2.jar
    fi
}

link_directories() {
    #create links
    ln -s /opt/bahmni-dhis2-integration-service/log /var/log/bahmni-dhis2-integration-service
    ln -s /opt/bahmni-dhis2-integration-service/etc /etc/bahmni-dhis2-integration-service
    ln -s /opt/bahmni-dhis2-integration-service/bin/bahmni-dhis2-integration-service /etc/init.d/bahmni-dhis2-integration-service
}

manage_permissions() {
    # permissions
    chown -R bahmni:bahmni /usr/bin/bahmni-dhis2-integration-service
    chown -R bahmni:bahmni /opt/bahmni-dhis2-integration-service
    chown -R bahmni:bahmni /var/log/bahmni-dhis2-integration-service
    chmod -R 777 /var/run/bahmni-dhis2-integration-service
}

updating_firewall_rules_to_allow_bahmni_dhis_service_port() {
    echo "allowing postgres port in firewall rules"
    sudo iptables -A INPUT -p tcp --dport 8060 -j ACCEPT -m comment --comment "BAHMNIDHIS"
    sudo service iptables save
}

run_migrations(){
    echo "Running openmrs liquibase-core-data.xml and liquibase-update-to-latest.xml"
    /opt/bahmni-dhis2-integration-service/etc/run-liquibase.sh
}

setupConfFiles() {
    	rm -f /etc/httpd/conf.d/bahmni-dhis2-integration-service-ssl.conf
    	cp -f /opt/bahmni-dhis2-integration-service/etc/bahmni-dhis2-integration-service-ssl.conf /etc/httpd/conf.d/bahmni-dhis2-integration-service-ssl.conf
}

link_properties_file() {
    echo "Linking properties file"
    ln -s /opt/bahmni-dhis2-integration-service/etc/bahmni-dhis.properties /opt/bahmni-dhis2-integration-service/properties/application.properties
}

chkconfig --add bahmni-dhis2-integration-service

setupConfFiles
create_bahmni_dhis_directories
link_directories
manage_permissions
getpostgresjar
run_migrations
setupConfFiles
link_properties_file
updating_firewall_rules_to_allow_bahmni_dhis_service_port
