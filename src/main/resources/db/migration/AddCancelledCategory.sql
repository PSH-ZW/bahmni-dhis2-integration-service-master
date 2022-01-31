BEGIN;
DO
$$
    DECLARE
        mapNames              text[];
        tempRow               text;
        countNewCancelled     int;
        countUpdatedCancelled int;
    BEGIN
        mapNames := (select array_agg(Distinct (program_name)) from marker);
        IF (count(mapNames) > 0)
        THEN
            FOREACH tempRow IN ARRAY mapNames
                LOOP
                    countNewCancelled :=
                            (select  count(marker_id) from marker where program_name = tempRow and category = 'new_cancelled_enrollment' limit 1);
                    countUpdatedCancelled :=
                            (select count(marker_id) from marker where program_name = tempRow and category = 'updated_cancelled_enrollment' limit 1);
                    IF (countNewCancelled = 0)
                    THEN
                        INSERT INTO marker(marker_id, program_name, category, last_synced_date)
                        VALUES (DEFAULT, tempRow, 'new_cancelled_enrollment', now());
                    END IF;
                    IF (countUpdatedCancelled = 0)
                    THEN
                        INSERT INTO marker(marker_id, program_name, category, last_synced_date)
                        VALUES (DEFAULT, tempRow, 'updated_cancelled_enrollment', now());
                    END IF;
                END LOOP;
        END IF;
    END
$$;
COMMIT;