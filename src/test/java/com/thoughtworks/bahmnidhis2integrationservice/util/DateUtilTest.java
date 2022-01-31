package com.thoughtworks.bahmnidhis2integrationservice.util;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.util.Date;
import java.util.TimeZone;

import static org.junit.Assert.assertEquals;
import static org.powermock.api.mockito.PowerMockito.doNothing;
import static org.powermock.api.mockito.PowerMockito.mockStatic;
import static org.powermock.api.mockito.PowerMockito.when;
import static org.powermock.api.mockito.PowerMockito.whenNew;

@RunWith(PowerMockRunner.class)
@PrepareForTest({DateUtil.class})
public class DateUtilTest {
    @Mock
    private ZoneId zoneId;

    @Mock
    private Date date;

    @Mock
    private SimpleDateFormat simpleDateFormat;

    @Mock
    private TimeZone timeZone;

    @Before
    public void setUp() throws Exception {
        mockStatic(TimeZone.class);
        whenNew(Date.class).withNoArguments().thenReturn(date);
        whenNew(SimpleDateFormat.class).withArguments(DateUtil.DATE_FORMAT_WITH_24HR_TIME).thenReturn(simpleDateFormat);
        when(TimeZone.getTimeZone(zoneId)).thenReturn(timeZone);
    }

    @Test
    public void shouldReturnGivenStringInUTC() throws ParseException {
        String dateStr = "2018-10-02 12:00:00";
        String utc = "2018-10-02 10:00:00";

        when(simpleDateFormat.parse(dateStr)).thenReturn(date);
        when(simpleDateFormat.format(date)).thenReturn(utc);

        String actualStr = DateUtil.getDateStringInUTC(dateStr, zoneId);

        assertEquals(utc, actualStr);
    }

    @Test
    public void shouldReturnUTCInServerTime() throws ParseException {
        String dateStr = "2018-10-02 12:00:00";
        String utc = "2018-10-02 10:00:00";

        when(simpleDateFormat.parse(utc)).thenReturn(date);
        when(simpleDateFormat.format(date)).thenReturn(dateStr);

        String actualStr = DateUtil.getDateStringInLocalFromUtc(utc, zoneId);

        assertEquals(dateStr, actualStr);
    }

    @Test
    public void shouldGetUTCTimeAsString() {
        when(TimeZone.getTimeZone("UTC")).thenReturn(timeZone);
        doNothing().when(simpleDateFormat).setTimeZone(timeZone);
        String utcString = "2018-12-28 12:34:12";
        when(simpleDateFormat.format(date)).thenReturn(utcString);

        assertEquals(utcString, DateUtil.getUTCDateTimeAsString());
    }
}
