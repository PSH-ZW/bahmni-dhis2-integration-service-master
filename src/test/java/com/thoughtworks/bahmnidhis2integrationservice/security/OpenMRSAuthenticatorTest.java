package com.thoughtworks.bahmnidhis2integrationservice.security;

import com.thoughtworks.bahmnidhis2integrationservice.CommonTestHelper;
import com.thoughtworks.bahmnidhis2integrationservice.config.AppProperties;
import com.thoughtworks.bahmnidhis2integrationservice.security.response.OpenMRSResponse;
import com.thoughtworks.bahmnidhis2integrationservice.util.SessionUtil;
import lombok.SneakyThrows;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import static com.thoughtworks.bahmnidhis2integrationservice.security.AuthenticationResponse.*;
import static com.thoughtworks.bahmnidhis2integrationservice.util.SessionUtil.APP_DHIS2SYNC;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;
import static org.powermock.api.mockito.PowerMockito.mockStatic;
import static org.powermock.api.mockito.PowerMockito.whenNew;
import static org.springframework.http.ResponseEntity.ok;
import static org.springframework.http.ResponseEntity.status;

@RunWith(PowerMockRunner.class)
@PrepareForTest({SessionUtil.class, RestTemplate.class, OpenMRSAuthenticator.class})
public class OpenMRSAuthenticatorTest {

  @Mock
  private AppProperties appProperties;

  @Mock
  private ResponseEntity<OpenMRSResponse> response;

  @Mock
  private RestTemplate restTemplate;

  private OpenMRSAuthenticator openMRSAuthenticator;

  @Before
  public void setUp() throws Exception {
    mockStatic(SessionUtil.class);
    when(appProperties.getOpenmrsRootUrl()).thenReturn("http://somehost:8888/openmrs/ws/rest/v1");

    openMRSAuthenticator = new OpenMRSAuthenticator();
    CommonTestHelper.setValuesForMemberFields(openMRSAuthenticator, "appProperties", appProperties);
  }

  @Test
  @SneakyThrows
  public void shouldAuthenticateGivenValidSessionId() {
    response = ok().body(new OpenMRSResponse());
    response.getBody().setAuthenticated(true);

    when(SessionUtil.hasPrivilege(APP_DHIS2SYNC)).thenReturn(true);

    whenNew(RestTemplate.class).withNoArguments().thenReturn(restTemplate);
    when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), any(Class.class)))
            .thenReturn(response);

    AuthenticationResponse response = openMRSAuthenticator.authenticate("TEST_SESSION_ID");

    Assert.assertEquals(AUTHORIZED, response);
  }

  @Test
  @SneakyThrows
  public void shouldNotAuthenticateGivenInvalidSessionId() {
    response = status(HttpStatus.UNAUTHORIZED).body(new OpenMRSResponse());

    whenNew(RestTemplate.class).withNoArguments().thenReturn(restTemplate);
    when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), any(Class.class)))
            .thenReturn(response);

    AuthenticationResponse response = openMRSAuthenticator.authenticate("TEST_SESSION_ID");

    Assert.assertEquals(NOT_AUTHENTICATED, response);
  }

  @Test
  @SneakyThrows
  public void shouldNotAuthorizeGivenValidSessionIdButInvalidPrivileges() {
    response = ok().body(new OpenMRSResponse());
    response.getBody().setAuthenticated(true);

    whenNew(RestTemplate.class).withNoArguments().thenReturn(restTemplate);
    when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), any(Class.class)))
            .thenReturn(response);

    AuthenticationResponse response = openMRSAuthenticator.authenticate("TEST_SESSION_ID");

    Assert.assertEquals(UNAUTHORIZED, response);
  }

  @Test
  @SneakyThrows
  public void shouldNotAuthorizeGivenValidSessionId() {
    response = ok().body(new OpenMRSResponse());
    HttpClientErrorException exception = new HttpClientErrorException(HttpStatus.BAD_REQUEST);

    whenNew(RestTemplate.class).withNoArguments().thenReturn(restTemplate);
    when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), any(Class.class)))
            .thenThrow(exception);

    AuthenticationResponse response = openMRSAuthenticator.authenticate("TEST_SESSION_ID");

    Assert.assertEquals(NOT_AUTHENTICATED, response);
  }

}