DROP TABLE IF EXISTS person_details_default CASCADE;
CREATE TABLE "public"."person_details_default" (
	"person_id" Integer,
	"person_name_id" Integer,
	"preferred" Text,
	"given_name" Text,
	"middle_name" Text,
	"family_name" Text,
	"gender" Text,
	"birthdate" Date,
	"birthtime" Time Without Time Zone,
	"birthdate_estimated" Text,
	"age" Text,
	"age_group" Text,
	"dead" Text,
	"death_date" Timestamp Without Time Zone,
	"deathdate_estimated" Text,
	"cause_of_death" Integer
);

DROP TABLE IF EXISTS patient_identifier CASCADE;
CREATE TABLE "public"."patient_identifier" (
	"patient_id" Integer NOT NULL,
	"OpenMRS_Identification_Number" Text,
	"Old_Identification_Number" Text,
	"Patient_Identifier" Text,
	"System_ID" Text,
	"UIC" Text,
	"PREP_OI_Identifier" Text,
	PRIMARY KEY ( "patient_id" )
);

DROP TABLE IF EXISTS mapping CASCADE;
CREATE TABLE "public"."mapping"(
  mapping_name text,
  lookup_table json,
  mapping_json json,
  config json,
  created_by text,
  date_created TIMESTAMP,
  modified_by text,
  date_modified TIMESTAMP
);

DROP TABLE IF EXISTS marker CASCADE;
CREATE TABLE "public"."marker"
(
  marker_id        SERIAL NOT NULL
    CONSTRAINT marker_pkey
    PRIMARY KEY,
  program_name     TEXT,
  category         TEXT,
  last_synced_date TIMESTAMP
);

DROP TABLE IF EXISTS log CASCADE;
CREATE TABLE "public"."log"(
	log_id SERIAL PRIMARY KEY,
	program text,
	synced_by text,
	comments text,
	status text,
	status_info text,
	date_created TIMESTAMP
);
