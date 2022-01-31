package com.thoughtworks.bahmnidhis2integrationservice.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.util.Date;
import java.util.TimeZone;

public class DateUtil {
    public static final String DATE_FORMAT_WITH_24HR_TIME = "yyyy-MM-dd HH:mm:ss";

    public static String getDateStringInUTC(String date, ZoneId zoneId) {
        Date serverDate = new Date(Long.MIN_VALUE);
        SimpleDateFormat serverFormat = new SimpleDateFormat(DATE_FORMAT_WITH_24HR_TIME);
        serverFormat.setTimeZone(TimeZone.getTimeZone(zoneId));
        try {
            serverDate = serverFormat.parse(date);
        } catch (ParseException ignored) {

        }

        SimpleDateFormat utcFormat = new SimpleDateFormat(DATE_FORMAT_WITH_24HR_TIME);
        utcFormat.setTimeZone(TimeZone.getTimeZone("UTC"));

        return utcFormat.format(serverDate);
    }

    public static String getDateStringInLocalFromUtc(String date, ZoneId zoneId) {
        Date utcDate = new Date(Long.MIN_VALUE);
        SimpleDateFormat utcFormat = new SimpleDateFormat(DATE_FORMAT_WITH_24HR_TIME);
        utcFormat.setTimeZone(TimeZone.getTimeZone("UTC"));

        try {
            utcDate = utcFormat.parse(date);
        } catch (ParseException ignored) {
        }

        SimpleDateFormat serverFormat = new SimpleDateFormat(DATE_FORMAT_WITH_24HR_TIME);
        serverFormat.setTimeZone(TimeZone.getTimeZone(zoneId));

        return serverFormat.format(utcDate);
    }

    public static String getUTCDateTimeAsString() {
        final SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT_WITH_24HR_TIME);
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        return sdf.format(new Date());
    }
}
