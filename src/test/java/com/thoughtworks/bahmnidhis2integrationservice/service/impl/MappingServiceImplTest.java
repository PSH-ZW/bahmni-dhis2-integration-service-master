package com.thoughtworks.bahmnidhis2integrationservice.service.impl;

import com.thoughtworks.bahmnidhis2integrationservice.dao.impl.MappingDAOImpl;
import com.thoughtworks.bahmnidhis2integrationservice.exception.NoMappingFoundException;
import com.thoughtworks.bahmnidhis2integrationservice.model.Mapping;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.powermock.modules.junit4.PowerMockRunner;

import java.util.*;

import static com.thoughtworks.bahmnidhis2integrationservice.CommonTestHelper.setValuesForMemberFields;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.powermock.api.mockito.PowerMockito.when;

@RunWith(PowerMockRunner.class)
public class MappingServiceImplTest {

    private MappingServiceImpl mappingService;

    @Mock
    private MappingDAOImpl mappingDAO;

    private String mappingName = "pat_details";
    private String mappingJson = "{\"instance\" : {\"patient_id\": \"Asj8X\", \"patient_name\": \"jghTk9\"}}";
    private String currentMapping = "";
    private String config = "{\"searchable\": [\"patient_id\", \"allergy_status\"]}";
    private String user = "superman";

    @Before
    public void setUp() throws Exception {
        mappingService = new MappingServiceImpl();
        setValuesForMemberFields(mappingService, "mappingDAO", mappingDAO);
    }

    @Test
    public void shouldReturnSuccessMessageOnInsertSuccess() throws Exception {
        String expected = "Successfully Added Mapping";
        when(mappingDAO.saveMapping(mappingName, mappingJson, config, currentMapping, user))
                .thenReturn(expected);

        String actual = mappingService.saveMapping(mappingName, mappingJson, config, currentMapping, user);

        verify(mappingDAO, times(1)).saveMapping(mappingName, mappingJson, config, currentMapping, user);
        assertEquals(expected, actual);
    }

    @Test
    public void shouldThrowErrorOnFail() throws Exception {
        String expected = "Could not able to insert";
        when(mappingDAO.saveMapping(mappingName, mappingJson, config, currentMapping, user))
                .thenThrow(new Exception(expected));

        try {
            mappingService.saveMapping(mappingName, mappingJson, config, currentMapping, user);
        } catch (Exception e) {
            verify(mappingDAO, times(1)).saveMapping(mappingName, mappingJson, config, currentMapping, user);
            assertEquals(expected, e.getMessage());
        }
    }

    @Test
    public void shouldGetAllMappingNames() {
        List<String> expected = Arrays.asList("HTS Service","TB Service");
        when(mappingDAO.getMappingNames()).thenReturn(expected);

        List<String> allMappings = mappingService.getMappingNames();

        assertEquals(allMappings,expected);
    }

    @Test
    public void shouldGetExistingMapping() throws NoMappingFoundException {
        Map<String, Object> HTSMapping = new HashMap<>();

        HTSMapping.put("mapping_name","HTS Service");
        HTSMapping.put("mapping_json","{\"instance\" : {\"patient_id\": \"Asj8X\", \"patient_name\": \"jghTk9\"}}");

        when(mappingDAO.getMapping("HTS Service")).thenReturn(HTSMapping);

        assertEquals(HTSMapping, mappingService.getMapping("HTS Service"));

        verify(mappingDAO, times(1)).getMapping("HTS Service");
    }

    @Test
    public void shouldThrowEmptyResultDataAccessExceptionWhenThereIsNoMapping() throws NoMappingFoundException {
        String mappingName = "someMapping";

        when(
                mappingDAO.getMapping(mappingName)
        ).thenThrow(new NoMappingFoundException(mappingName));

        try{
            mappingService.getMapping(mappingName);
        }catch (NoMappingFoundException e){
            assertEquals(e.getMessage(),"Mapping " + mappingName + " not found.");
        }
    }

    @Test
    public void shouldReturnSuccessMessageOnSuccessImportOfMappings() throws Exception {
        String expected = "Successfully Added Mapping";
        Mapping mapping = new Mapping("insert mapping", "", mappingJson, config, "superman");

        List<Mapping> mappings = Collections.singletonList(mapping);

        when(mappingDAO.saveMapping(mappings)).thenReturn(expected);

        String actual = mappingService.saveMapping(mappings);

        verify(mappingDAO, times(1)).saveMapping(mappings);
        assertEquals(expected, actual);
    }

    @Test
    public void shouldThrowErrorOnMappingImportFail() throws Exception {
        String expected = "Could not able to insert";
        Mapping mapping = new Mapping("insert mapping", "", mappingJson, config, "superman");

        List<Mapping> mappings = Collections.singletonList(mapping);
        when(mappingDAO.saveMapping(mappings)).thenThrow(new Exception(expected));

        try {
            mappingService.saveMapping(mappings);
        } catch (Exception e) {
            verify(mappingDAO, times(1)).saveMapping(mappings);
            assertEquals(expected, e.getMessage());
        }
    }

    @Test
    public void shouldGetAllTheExistingMappings() throws NoMappingFoundException {
        Map<String, Object> htsMapping = new HashMap<>();
        htsMapping.put("mappingName", "HTS Service");
        htsMapping.put("mappingJson", "{\"patient_id\": \"Asj8X\", \"patient_name\": \"jghTk9\"}");

        Map<String, Object> tbMapping = new HashMap<>();
        tbMapping.put("mappingName", "TB Service");
        tbMapping.put("mappingJson", "{\"patient_id\": \"Asj8X\", \"patient_name\": \"jghTk9\"}");

        List<Map<String, Object>>  expected = new ArrayList<>();
        expected.add(htsMapping);
        expected.add(tbMapping);

        when(mappingDAO.getAllMappings()).thenReturn(expected);

        assertEquals(expected, mappingService.getAllMappings());

        verify(mappingDAO, times(1)).getAllMappings();
    }

    @Test
    public void shouldThrowEmptyResultDataAccessExceptionWhenAreNoMappings() throws NoMappingFoundException {
        when(mappingDAO.getAllMappings()).thenThrow(new NoMappingFoundException(""));

        try{
            mappingService.getAllMappings();
        }catch (NoMappingFoundException e){
            assertEquals("Mapping  not found.", e.getMessage());
        }
    }

}
