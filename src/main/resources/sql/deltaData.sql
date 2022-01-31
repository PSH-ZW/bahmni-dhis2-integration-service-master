SELECT COALESCE(instanceTable."Patient_Identifier", programEnrollmentsTable."Patient_Identifier",
                eventsTable."Patient_Identifier")       AS "Patient Identifier",
       (SELECT orgunit
        FROM orgunit_tracker
        WHERE orgunit = COALESCE(eventsTable."OrgUnit", programEnrollmentsTable."OrgUnit",
                                 instanceTable."OrgUnit"))AS "Org Unit",
       %s
       instanceTable.date_created :: text               AS "Instance Date Created",
       COALESCE(programEnrollmentsTable.enrollment_date,
                eventsTable.enrollment_date)               "Enrollment Date",
       programEnrollmentsTable.incident_date               "Incident Date",
       programEnrollmentsTable.status                      "Enrollment Status",
       programEnrollmentsTable.date_created :: text     AS "Prog Enrollment Date Created",
       eventsTable.event_date                              "Event Date",
       eventsTable.program                                 "Program",
       eventsTable.program_stage                           "Program Stage",
       eventsTable.status                                  "Event Status",
       %s
       eventsTable.date_created :: text                 AS "Event Date Created"
FROM (SELECT pi.*
      FROM %s pi
             INNER JOIN marker m on pi.date_created :: TIMESTAMP > COALESCE(m.last_synced_date, '-infinity')
                                      AND category = 'instance' AND program_name = '%s') AS instanceTable
 FULL OUTER JOIN (

        (SELECT prog.* FROM %s prog
            INNER JOIN marker m ON prog.date_created :: TIMESTAMP > COALESCE(m.last_synced_date, '-infinity')
            AND category = 'new_completed_enrollment' AND program_name = '%s')
        UNION
        (SELECT prog.* FROM %s prog
            INNER JOIN marker m ON prog.date_created :: TIMESTAMP > COALESCE(m.last_synced_date, '-infinity')
            AND category = 'updated_completed_enrollment' AND program_name = '%s')
        UNION
        (SELECT prog.* FROM %s prog
            INNER JOIN marker m ON prog.date_created :: TIMESTAMP > COALESCE(m.last_synced_date, '-infinity')
            AND category = 'new_active_enrollment' AND program_name = '%s')
        UNION
        (SELECT prog.* FROM %s prog
            INNER JOIN marker m ON prog.date_created :: TIMESTAMP > COALESCE(m.last_synced_date, '-infinity')
            AND category = 'updated_active_enrollment' AND program_name = '%s')
        UNION
         (SELECT prog.* FROM %s prog
            INNER JOIN marker m ON prog.date_created :: TIMESTAMP > COALESCE(m.last_synced_date, '-infinity')
            AND category = 'updated_cancelled_enrollment' AND program_name = '%s')
        UNION
         (SELECT prog.* FROM %s prog
            INNER JOIN marker m ON prog.date_created :: TIMESTAMP > COALESCE(m.last_synced_date, '-infinity')
            AND category = 'new_cancelled_enrollment' AND program_name = '%s')
      ) AS programEnrollmentsTable
   ON instanceTable."Patient_Identifier" = programEnrollmentsTable."Patient_Identifier"

 FULL OUTER JOIN (SELECT event.*
                   FROM %s event
                          INNER JOIN marker m
                            ON event.date_created :: TIMESTAMP > COALESCE(m.last_synced_date, '-infinity')
                                 AND category = 'event' AND program_name = '%s') AS eventsTable
   ON COALESCE(instanceTable."Patient_Identifier", programEnrollmentsTable."Patient_Identifier") = eventsTable."Patient_Identifier"
      AND eventsTable.enrollment_date = COALESCE(programEnrollmentsTable.enrollment_date, eventsTable.enrollment_date)
      AND eventsTable.patient_program_id = programEnrollmentsTable.program_unique_id
ORDER BY eventsTable.date_created, programEnrollmentsTable.date_created, instanceTable.date_created;





