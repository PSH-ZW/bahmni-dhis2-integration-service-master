package com.thoughtworks.bahmnidhis2integrationservice.util;

import org.apache.commons.io.IOUtils;
import org.springframework.core.io.Resource;

import java.io.IOException;

public class PreviewUtil {
    public static String convertResourceOutputToString(Resource resource) throws IOException {

        return IOUtils.toString(resource.getInputStream());

    }
}
