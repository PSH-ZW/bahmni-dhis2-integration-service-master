package com.thoughtworks.bahmnidhis2integrationservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class MappingDetails {
    private String date;
    private String status;
    private boolean checkBoxClicked;
    private Date startDate;
    private Date endDate;
}
