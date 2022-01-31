package com.thoughtworks.bahmnidhis2integrationservice.model;

import com.google.gson.internal.LinkedTreeMap;
import lombok.Data;

@Data
public class MappingJson {

    private LinkedTreeMap instance;
    private LinkedTreeMap event;
}
