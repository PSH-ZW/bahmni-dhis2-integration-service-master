package com.thoughtworks.bahmnidhis2integrationservice.util;

import org.apache.commons.io.IOUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.io.InputStream;

import static org.junit.Assert.*;
import static org.mockito.Mockito.when;
import static org.powermock.api.mockito.PowerMockito.mockStatic;

@RunWith(PowerMockRunner.class)
@PrepareForTest(IOUtils.class)
public class PreviewUtilTest {

    @Mock
    private Resource resource;

    @Mock
    private InputStream inputStream;

    private String result;

    @Before
    public void setUp() throws Exception {
        result = "Select * from patient";
        when(resource.getInputStream()).thenReturn(inputStream);
        mockStatic(IOUtils.class);
        when(IOUtils.toString(inputStream)).thenReturn(result);
    }

    @Test
    public void shouldConvertResourceToString() throws IOException {
        assertEquals(result, PreviewUtil.convertResourceOutputToString(resource));
    }
}