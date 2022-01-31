package com.thoughtworks.bahmnidhis2integrationservice.util;

import com.thoughtworks.bahmnidhis2integrationservice.security.response.Privilege;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.modules.junit4.PowerMockRunner;

import java.util.Arrays;
import java.util.List;

import static com.thoughtworks.bahmnidhis2integrationservice.CommonTestHelper.setValuesForMemberFields;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

@RunWith(PowerMockRunner.class)
public class SessionUtilTest {

  private SessionUtil sessionUtil;
  private List<Privilege> privileges;

  private List<Privilege>  getPrivileges(){
    Privilege APP_DHIS2SYNC_UPLOAD = new Privilege();
    APP_DHIS2SYNC_UPLOAD.setDisplay("app:dhis2sync:upload");

    Privilege APP_DHIS2SYNC_LOG = new Privilege();
    APP_DHIS2SYNC_LOG.setDisplay("app:dhis2sync:log");

    Privilege SOME_RANDOM_PRIVILEGE = new Privilege();
    SOME_RANDOM_PRIVILEGE.setDisplay("app:admin");

    return Arrays.asList(
            APP_DHIS2SYNC_LOG,
            APP_DHIS2SYNC_UPLOAD,
            SOME_RANDOM_PRIVILEGE
    );
  }

  @Before
  public void setUp() throws Exception {
    sessionUtil = new SessionUtil();
    List<String> privilegesInStringFormat = Arrays.asList("test:privilege", "dev:privilege");

    privileges = getPrivileges();

    setValuesForMemberFields(sessionUtil, "availablePrivileges", privilegesInStringFormat);
  }

  @Test
  public void shouldSaveGivenSetOfPrivileges() throws Exception {
    assertEquals(SessionUtil.getAvailablePrivileges().get(0), "test:privilege");
  }

  @Test
  public void shouldReturnTrueIfAGivenPrivilegeIsAvailable() throws Exception {
    assertTrue(SessionUtil.hasPrivilege("test:privilege"));
  }

  @Test
  public void shouldReturnFalseIfAGivenPrivilegeIsNotAvailable() throws Exception {
    assertFalse(SessionUtil.hasPrivilege("privilege"));
  }

  @Test
  public void shouldSavePrivileges() {
    String APP_DHIS2SYNC_UPLOAD = "app:dhis2sync:upload";

    String APP_DHIS2SYNC_LOG = "app:dhis2sync:log";

    List<String> expected = Arrays.asList(APP_DHIS2SYNC_LOG, APP_DHIS2SYNC_UPLOAD);

    SessionUtil.savePrivileges(privileges);

    assertEquals(expected, SessionUtil.getAvailablePrivileges());
  }
}
