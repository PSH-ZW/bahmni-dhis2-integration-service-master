import Ajax from "../common/Ajax";

export async function getDeltaData(mappingName) {
    return await Ajax.instance().get('/dhis-integration/api/getDeltaData', {mappingName});
}

export async function getDeltaDataWithStartEndDates(mappingName,startDate,endDate) {
    return await Ajax.instance().get('/dhis-integration/api/getDeltaData', {mappingName,startDate, endDate});
}