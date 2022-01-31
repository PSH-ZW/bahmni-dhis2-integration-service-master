INSERT INTO mapping (mapping_name, lookup_table, mapping_json, config, created_by, date_created) VALUES ('HTS Service','{"instance":"HTS_Instance","enrollments":"HTS_Enrollment","event":"HTS_Event"}','{"instance" : {"First Name" : "ZtnSKh7UQTV","Last Name" : "adBbi66uP8B"}, "event" : { "Have TB" : "abFL60KXhXk", "HIV Self Test" : "QjPBRXZisYv", "Need counseling" : "YvkWbpS3D8d"}}', '{"searchable":["UIC","Gender"],"comparable":["UIC","OrgUnit"],"openLatestCompletedEnrollment":"no"}', 'admin','02/15/2018');
INSERT INTO mapping (mapping_name, lookup_table, mapping_json, config, created_by, date_created) VALUES ('TB Service','{"instance":"TB_Instance", "enrollments": "TB_enr", "event": "TB_event"}','{"instance" : { "First Name" : "ZtnSKh7UQTV","Last Name" : "adBbi66uP8B"},  "event" : { "Have TB" : "abFL60KXhXk"}}', '{"searchable":["UIC"],"comparable":[],"openLatestCompletedEnrollment":"no"}','admin','2018-10-03 11:21:32.000000');
INSERT INTO mapping (mapping_name, lookup_table, mapping_json, config, created_by, date_created) VALUES ('Failed Service','{"instance":"Failed_Instance", "enrollments": "Failed_enr", "event": "Failed_events"}','{"instance" : { "First Name" : "ZtnSKh7UQTV","Last Name" : "adBbi66uP8B"}, "event" : { "Have TB" : "abFL60KXhXk"}}', '{"searchable":[],"comparable":[],"openLatestCompletedEnrollment":"yes"}','admin','2018-11-03 11:21:32.000000');

INSERT INTO marker (program_name, category, last_synced_date) VALUES ('HTS Service', 'instance', null);
INSERT INTO marker (program_name, category, last_synced_date) VALUES ('HTS Service', 'new_active_enrollment', null);
INSERT INTO marker (program_name, category, last_synced_date) VALUES ('HTS Service', 'new_completed_enrollment', null);
INSERT INTO marker (program_name, category, last_synced_date) VALUES ('HTS Service', 'new_cancelled_enrollment', null);
INSERT INTO marker (program_name, category, last_synced_date) VALUES ('HTS Service', 'updated_cancelled_enrollment', null);
INSERT INTO marker (program_name, category, last_synced_date) VALUES ('HTS Service', 'updated_active_enrollment', null);
INSERT INTO marker (program_name, category, last_synced_date) VALUES ('HTS Service', 'updated_completed_enrollment', null);
INSERT INTO marker (program_name, category, last_synced_date) VALUES ('HTS Service', 'events', null);

INSERT INTO marker (program_name, category, last_synced_date) VALUES ('TB Service', 'instance', null);
INSERT INTO marker (program_name, category, last_synced_date) VALUES ('TB Service', 'new_active_enrollment', null);
INSERT INTO marker (program_name, category, last_synced_date) VALUES ('TB Service', 'new_completed_enrollment', null);
INSERT INTO marker (program_name, category, last_synced_date) VALUES ('TB Service', 'new_cancelled_enrollment', null);
INSERT INTO marker (program_name, category, last_synced_date) VALUES ('TB Service', 'updated_cancelled_enrollment', null);
INSERT INTO marker (program_name, category, last_synced_date) VALUES ('TB Service', 'updated_active_enrollment', null);
INSERT INTO marker (program_name, category, last_synced_date) VALUES ('TB Service', 'updated_completed_enrollment', null);
INSERT INTO marker (program_name, category, last_synced_date) VALUES ('TB Service', 'events', null);

INSERT INTO marker (program_name, category, last_synced_date) VALUES ('Failed Service', 'instance', null);
INSERT INTO marker (program_name, category, last_synced_date) VALUES ('Failed Service', 'new_active_enrollment', null);
INSERT INTO marker (program_name, category, last_synced_date) VALUES ('Failed Service', 'new_completed_enrollment', null);
INSERT INTO marker (program_name, category, last_synced_date) VALUES ('Failed Service', 'new_cancelled_enrollment', null);
INSERT INTO marker (program_name, category, last_synced_date) VALUES ('Failed Service', 'updated_active_enrollment', null);
INSERT INTO marker (program_name, category, last_synced_date) VALUES ('Failed Service', 'updated_cancelled_enrollment', null);
INSERT INTO marker (program_name, category, last_synced_date) VALUES ('Failed Service', 'updated_completed_enrollment', null);
INSERT INTO marker (program_name, category, last_synced_date) VALUES ('Failed Service', 'events', null);

INSERT INTO log (log_id, program, synced_by, comments, status, status_info, date_created) VALUES (1, 'HTS Service', 'superman', 'First Comment', 'success', '', '2018-10-03 11:21:32.000000');
INSERT INTO log (log_id, program, synced_by, comments, status, status_info, date_created) VALUES (2, 'TB Service', 'superman', 'Second Comment', 'success', '', '2018-10-04 11:21:32.000000');
