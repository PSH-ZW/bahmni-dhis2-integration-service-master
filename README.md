# bahmni-dhis2-integration-service
Each clinic will be using Bahmni as an EMR solution for all the type of services. The data from Bahmni clinic server will be synced to DHIS2 server using a custom build integration service deployed in the Bahmni clinic server.

In DHIS2 programs are configured as events with registration(Line level data), where patient registration information is captured along with the program enrollment and events.
From Bahmni we will be sending the below patient data:
Patient registration
Patient program enrollment
Data captured through forms in each visit

Bahmni mart, a custom build service used to flatten the OpenMRS hierarchical tables will be used to create below three tables for each service.
Patient instance
Patient program enrollment
Patient program events

Implementer will be creating these tables using custom SQL scripts configured in Bahmni mart. Table columns for each table will be mapped to DHIS2 data elements using an user interface.

Integration service will use the mapping information to sync the data from the above tables to DHIS2.
